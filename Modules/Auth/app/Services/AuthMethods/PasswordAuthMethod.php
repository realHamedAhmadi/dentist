<?php

namespace Modules\Auth\Services\AuthMethods;

use Modules\Auth\Contracts\AuthMethodStrategyInterface;
use Modules\Auth\Enums\AuthMethod;
use Modules\Auth\Traits\AuthMethodTrait;
use Modules\User\Models\User;

class PasswordAuthMethod implements AuthMethodStrategyInterface
{
    use AuthMethodTrait;

    public function supports(User|null $user): bool
    {
        return (bool)$user?->password;
    }

    public function getMethod(): string
    {
        return AuthMethod::PASSWORD->value;
    }

    public function requiresVerification(User|null $user): bool
    {
        return !(bool)$user?->password;
    }

}
