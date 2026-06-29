<?php

namespace Modules\Auth\Contracts;

use Modules\Auth\DTO\AuthDiscoveryResult;

interface AuthDiscoveryStrategyInterface
{
    public function supports(string $identifier): bool;

    public function discover(string $identifier): AuthDiscoveryResult;
}
