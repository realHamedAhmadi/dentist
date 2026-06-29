<?php

namespace Modules\Core\Services\User;

use Modules\Core\Enums\IdentifierType;
use Modules\User\Models\User;

class FindUserByUsername extends AbstractFindUserByIdentifier
{
    protected IdentifierType $type=IdentifierType::USERNAME;

    public function query()
    {
        return User::query();
    }
}
