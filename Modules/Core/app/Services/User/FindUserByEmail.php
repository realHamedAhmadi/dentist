<?php

namespace Modules\Core\Services\User;

use Modules\Core\Enums\IdentifierType;
use Modules\User\Models\User;

class FindUserByEmail extends AbstractFindUserByIdentifier
{
    protected IdentifierType $type=IdentifierType::EMAIL;

    public function query()
    {
        return User::query();
    }
}
