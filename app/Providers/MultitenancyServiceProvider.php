<?php
namespace App\Providers;

use App\Multitenancy\Finders\ChainedTenantFinder;
use App\Multitenancy\Finders\CustomDomainFinder;
use App\Multitenancy\Finders\HeaderFinder;
use App\Multitenancy\Finders\SubdomainFinder;
use Illuminate\Support\ServiceProvider;

class MultitenancyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ChainedTenantFinder::class, function ($app) {
            return new ChainedTenantFinder(
                domainFinder:    $app->make(CustomDomainFinder::class),
                subdomainFinder: $app->make(SubdomainFinder::class),
                headerFinder:    $app->make(HeaderFinder::class),
            );
        });
    }
}
