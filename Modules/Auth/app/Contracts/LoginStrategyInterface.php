<?php

namespace Modules\Auth\Contracts;

use Modules\Auth\DTO\AuthenticatedResult;
use Modules\Core\Enums\IdentifierType;

interface LoginStrategyInterface
{
    public function isEnable():bool;

    public function type():IdentifierType;

    public function supports(string $identifier): bool;

    /**
     * handle login flow
     */
    public function handle(
        string $identifier,
        ?string $credential,
        array $options = []
    ): AuthenticatedResult;
}
