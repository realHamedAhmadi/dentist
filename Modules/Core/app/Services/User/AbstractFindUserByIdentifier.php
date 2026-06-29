<?php

namespace Modules\Core\Services\User;

use Modules\Core\Contracts\Services\FindUserByIdentifierInterface;
use Modules\Core\Enums\IdentifierType;
use Modules\User\Models\User;

abstract class AbstractFindUserByIdentifier implements FindUserByIdentifierInterface
{
    protected IdentifierType $type;

    abstract public function query();

    public function get(string $identifier): ?User
    {
        return $this->query()->where($this->type->value,$identifier)->first();
    }
}
