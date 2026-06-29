<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        EloquentBuilder::macro('table', function () {
            return $this->getModel()->getTable();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        Factory::guessFactoryNamesUsing(function (string $modelName) {
            // ما مسیر factory رو بر اساس namespace مدل تغییر می‌دیم

            return str_replace(
                    ['Modules\\', '\\Models\\', 'Models\\'],
                    ['Modules\\', '\\Database\\Factories\\', 'Database\\Factories\\'],
                    $modelName
                ) . 'Factory';
        });
    }
}
