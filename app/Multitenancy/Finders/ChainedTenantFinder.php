<?php
namespace App\Multitenancy\Finders;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Spatie\Multitenancy\Contracts\FindsTenants;
use Spatie\Multitenancy\Models\Tenant as BaseTenant;

class ChainedTenantFinder implements FindsTenants
{
    public function __construct(
        private readonly CustomDomainFinder $domainFinder,
        private readonly SubdomainFinder    $subdomainFinder,
        private readonly HeaderFinder       $headerFinder,
    ) {}

    public function findForRequest(Request $request): ?BaseTenant
    {
        // Priority 1: Full custom domain
        $tenant = $this->domainFinder->findForRequest($request);
        if ($tenant) {
            return $tenant;
        }

        // Priority 2: Subdomain
        $tenant = $this->subdomainFinder->findForRequest($request);
        if ($tenant) {
            return $tenant;
        }

        // Priority 3: HTTP header (for SPA / API clients)
        return $this->headerFinder->findForRequest($request);
    }
}
