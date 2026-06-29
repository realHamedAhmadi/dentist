<?php

namespace Modules\User\Providers;

use Closure;
use Illuminate\Support\Collection;
use Illuminate\Support\HigherOrderCollectionProxy;
use Illuminate\Support\ServiceProvider;
use Modules\User\Models\Client;
use Modules\User\Models\Staff;
use Modules\User\Models\User;
use Modules\User\Observers\ClientObserver;
use Modules\User\Observers\StaffObserver;
use Modules\User\Observers\UserObserver;

class ObserverServiceProvider extends ServiceProvider
{
    /**
     * Register the service provider.
     */
    public function register(): void {}

    /**
     * Get the services provided by the provider.
     */
    public function provides(): array
    {
        return [];
    }

    public function boot()
    {
        Client::observe(ClientObserver::class);
        User::observe(UserObserver::class);
    }
}
