<?php
namespace App\Multitenancy\Tasks;

use Illuminate\Support\Facades\Cache;
use Spatie\Multitenancy\Contracts\IsTenant;
use Spatie\Multitenancy\Tasks\SwitchTenantTask;

class SetTenantCachePrefix implements SwitchTenantTask
{
    public function makeCurrent(IsTenant $tenant): void
    {
        // Isolate cache entries per tenant to avoid cross-tenant leaks
        config(['cache.prefix' => "tenant_{$tenant->id}"]);
    }

    public function forgetCurrent(): void
    {
        config(['cache.prefix' => config('cache.prefix')]);
    }
}
