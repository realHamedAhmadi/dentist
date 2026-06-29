<?php

namespace Modules\Auth\Services\AuthMethods;

use Modules\Auth\Contracts\AuthMethodStrategyInterface;
use Modules\Auth\Enums\AuthMethod;
use Modules\Auth\Traits\AuthMethodTrait;
use Modules\User\Models\User;

class CodeAuthMethod implements AuthMethodStrategyInterface
{
    use AuthMethodTrait;

    public function supports(User|null $user): bool
    {
        return true;
    }

    public function getMethod(): string
    {
        return AuthMethod::CODE->value;
    }

    public function requiresVerification(User|null $user): bool
    {
        return $user?->password === null;
    }
}
