<?php

namespace Modules\Auth\Contracts;

use Modules\User\Models\User;

interface AuthMethodStrategyInterface
{
    public function isEnable():bool;
    public function supports(User|null $user): bool;
    public function getMethod(): string;
    public function requiresVerification(User|null $user): bool;
}

