<?php

namespace App\Multitenancy\Finders;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Spatie\Multitenancy\Contracts\FindsTenants;
use Spatie\Multitenancy\Models\Tenant as BaseTenant;

class SubdomainFinder implements FindsTenants
{
    public function findForRequest(Request $request): ?BaseTenant
    {
        $host      = $request->getHost();
        $baseDomain = config('multitenancy.base_domain'); // e.g. "app.yoursaas.com"

        // Extract subdomain slug: "clinic-a.app.yoursaas.com" → "clinic-a"
        if (! str_ends_with($host, '.' . $baseDomain)) {
            return null;
        }

        $subdomain = str($host)->before('.' . $baseDomain)->toString();

        if (empty($subdomain)) {
            return null;
        }

        return Tenant::where('subdomain', $subdomain)
            ->where('status', 'active')
            ->first();
    }
}
