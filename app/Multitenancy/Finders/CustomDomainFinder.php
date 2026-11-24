<?php
namespace App\Multitenancy\Finders;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Spatie\Multitenancy\Contracts\FindsTenants;
use Spatie\Multitenancy\Models\Tenant as BaseTenant;

class CustomDomainFinder implements FindsTenants
{
    public function findForRequest(Request $request): ?BaseTenant
    {
        $host = $request->getHost();

        return Tenant::where('domain', $host)
            ->where('status', 'active')
            ->first();
    }
}
