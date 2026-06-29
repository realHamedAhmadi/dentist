<?php

namespace Modules\Core\Providers;

use Illuminate\Support\ServiceProvider;
use Modules\Core\Enums\IdentifierType;
use Modules\Core\Services\User\FindUserByEmail;
use Modules\Core\Services\User\FindUserByNationalCode;
use Modules\Core\Services\User\FindUserByPhone;
use Modules\Core\Services\User\FindUserByUsername;
use Modules\Core\Services\User\FindUserService;

class CoreServiceProvider extends ServiceProvider
{
    protected function identifierMap():array
    {
        return [
            IdentifierType::PHONE->value => FindUserByPhone::class,
            IdentifierType::EMAIL->value => FindUserByEmail::class,
            IdentifierType::USERNAME->value => FindUserByUsername::class,
            IdentifierType::NATIONAL_CODE->value=>FindUserByNationalCode::class
        ];
    }

    public function boot(): void
    {
    }

    public function register()
    {
        $this->app->singleton(FindUserService::class,function (){
            return new FindUserService($this->identifierMap());
        });
    }
}
