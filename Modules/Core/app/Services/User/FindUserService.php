<?php

namespace Modules\Core\Services\User;

use Modules\Core\Enums\IdentifierType;
use Modules\Core\Exceptions\UserIdentifierHandlerNotFoundException;
use Modules\Core\Helpers\Identifier;
use Modules\User\Models\User;

class FindUserService
{

    public function __construct( protected readonly array $identifierMap)
    {
    }

    public function get(string $identifier): ?User
    {
        $type = $this->identifierType($identifier);

        $map = $this->identifierMap[$type->value] ?? null;
        if (!$map) {
            throw new UserIdentifierHandlerNotFoundException($type);
        }

        return app($map)->get($identifier);
    }

    protected function identifierType(string $identifier): IdentifierType
    {
        return Identifier::detect($identifier);
    }

}
