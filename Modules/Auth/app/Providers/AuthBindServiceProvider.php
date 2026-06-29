<?php

namespace Modules\Auth\Providers;

use Illuminate\Support\ServiceProvider;
use Modules\Auth\Contracts\LoginPolicyInterface;
use Modules\Auth\Contracts\TokenProviderInterface;
use Modules\Auth\Policies\LoginPolicy;
use Modules\Auth\Services\LoginCaseRegistry;
use Modules\Auth\Services\Providers\SanctumTokenProvider;

class AuthBindServiceProvider extends ServiceProvider
{
    /**
     * Register the service provider.
     */
    public function register(): void
    {
        $this->app->singleton(LoginCaseRegistry::class, fn() => new LoginCaseRegistry());
        $this->app->singleton(TokenProviderInterface::class, fn() => new SanctumTokenProvider());
        $this->app->singleton(LoginPolicyInterface::class,fn()=> new LoginPolicy());

    }

    /**
     * Get the services provided by the provider.
     */
    public function provides(): array
    {
        return [];
    }
}
