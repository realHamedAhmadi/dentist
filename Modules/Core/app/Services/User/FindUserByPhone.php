<?php

namespace Modules\Core\Services\User;

use Modules\Core\Enums\IdentifierType;
use Modules\User\Models\User;

class FindUserByPhone extends AbstractFindUserByIdentifier
{
    protected IdentifierType $type=IdentifierType::PHONE;

    public function query()
    {
        return User::query();
    }
}
