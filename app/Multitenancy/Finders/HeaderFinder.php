<?php

namespace App\Multitenancy\Finders;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Spatie\Multitenancy\TenantFinder\TenantFinder;
use Spatie\Multitenancy\Models\Tenant as BaseTenant;

class HeaderFinder extends TenantFinder
{
    // Header name used by SPA/API clients that cannot set a subdomain
    public const HEADER = 'X-Tenant-ID';

    public function findForRequest(Request $request): ?BaseTenant
    {
        $tenantId = $request->header(self::HEADER);

        if (blank($tenantId)) {
            return null;
        }

        return Tenant::where('id', $tenantId)
            ->where('status', 'active')
            ->first();
    }
}
