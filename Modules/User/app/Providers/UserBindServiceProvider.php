<?php

namespace Modules\User\Providers;

use Illuminate\Support\ServiceProvider;
use Modules\User\Config\DbVerificationConfig;
use Modules\User\Contracts\Config\VerificationConfigInterface;
use Modules\Verification\Services\VerificationService;

class UserBindServiceProvider extends ServiceProvider
{
    /**
     * Register the service provider.
     */
    public function register(): void {
        $this->app->singleton(VerificationConfigInterface::class,fn()=>
           new DbVerificationConfig()
        );
    }

    /**
     * Get the services provided by the provider.
     */
    public function provides(): array
    {
        return [];
    }
}
