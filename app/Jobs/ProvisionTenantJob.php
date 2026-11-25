<?php

namespace App\Jobs;

use App\DTO\CreateTenantData;
use App\Models\Tenant;
use App\Events\TenantProvisioned;
use App\Events\TenantProvisioningFailed;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProvisionTenantJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Maximum number of retry attempts before the job is failed.
     */
    public int $tries = 3;

    /**
     * Delay in seconds between retry attempts.
     */
    public int $backoff = 10;

    /**
     * Maximum execution time in seconds before the job times out.
     */
    public int $timeout = 120;

    public function __construct(
        private readonly CreateTenantData $data,
    ) {}

    public function handle(): void
    {
        $tenant = $this->createTenantRecord();

        try {
            $this->createDatabase($tenant);
            $this->runMigrations($tenant);
            $this->runSeeders($tenant);
            $this->markAsActive($tenant);

            event(new TenantProvisioned($tenant));

            Log::info('Tenant provisioned successfully', [
                'tenant_id' => $tenant->id,
                'slug'      => $tenant->slug,
                'database'  => $tenant->database,
            ]);
        } catch (Throwable $e) {
            // Roll back: drop the DB if it was created, then mark tenant as failed
            $this->rollback($tenant);

            event(new TenantProvisioningFailed($tenant, $e));

            Log::error('Tenant provisioning failed', [
                'tenant_id' => $tenant->id,
                'error'     => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    // ---------------------------------------------------------------------------
    // Private steps
    // ---------------------------------------------------------------------------

    private function createTenantRecord(): Tenant
    {
        $dbName = $this->resolveDatabaseName($this->data->slug);

        return Tenant::create([
            'name'     => $this->data->name,
            'slug'     => $this->data->slug,
            'domain'   => $this->data->domain,
            'database' => $dbName,
            'status'   => 'provisioning',
            'meta'     => $this->data->meta,
        ]);
    }

    private function createDatabase(Tenant $tenant): void
    {
        // Uses the landlord connection; DB name is already validated via slug
        DB::connection('landlord')
            ->statement("CREATE DATABASE `{$tenant->database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    }

    private function runMigrations(Tenant $tenant): void
    {
        // Switch to tenant context so Artisan runs against the tenant connection
        $tenant->makeCurrent();

        Artisan::call('tenants:artisan', [
            'artisanCommand' => 'migrate',
            '--path'         => 'database/migrations/tenant',
            '--force'        => true,
        ]);

        Tenant::forgetCurrent();
    }

    private function runSeeders(Tenant $tenant): void
    {
        $tenant->makeCurrent();

        Artisan::call('tenants:artisan', [
            'artisanCommand' => 'db:seed',
            '--class'        => \Database\Seeders\Tenant\TenantDatabaseSeeder::class,
            '--force'        => true,
        ]);

        Tenant::forgetCurrent();
    }

    private function markAsActive(Tenant $tenant): void
    {
        $tenant->update(['status' => 'active']);
    }

    private function rollback(Tenant $tenant): void
    {
        try {
            DB::connection('landlord')
                ->statement("DROP DATABASE IF EXISTS `{$tenant->database}`");
        } catch (Throwable) {
            // Best-effort cleanup; log but don't re-throw
        }

        $tenant->update(['status' => 'failed']);
    }

    /**
     * Derive a safe, deterministic database name from the tenant slug.
     * Pattern: dentist_{slug} with non-alphanumeric chars replaced by underscores.
     */
    private function resolveDatabaseName(string $slug): string
    {
        $safe = preg_replace('/[^a-z0-9]/', '_', strtolower($slug));

        return 'dentist_' . $safe;
    }

    /**
     * Called by Laravel when all retry attempts are exhausted.
     */
    public function failed(Throwable $exception): void
    {
        Log::critical('ProvisionTenantJob permanently failed', [
            'slug'  => $this->data->slug,
            'error' => $exception->getMessage(),
        ]);
    }
}
