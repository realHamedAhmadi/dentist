<?php
namespace App\Multitenancy\Tasks;

use Spatie\Multitenancy\Contracts\IsTenant;
use Spatie\Multitenancy\Tasks\SwitchTenantTask;

class SetTenantQueueContext implements SwitchTenantTask
{
    public function makeCurrent(IsTenant $tenant): void
    {
        // Inject tenant_id into queue job payload so async jobs
        // know which tenant they belong to
        config(['queue.default_tenant_id' => $tenant->id]);
    }

    public function forgetCurrent(): void
    {
        config(['queue.default_tenant_id' => null]);
    }
}
