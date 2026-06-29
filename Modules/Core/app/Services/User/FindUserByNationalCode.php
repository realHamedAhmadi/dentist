<?php

namespace Modules\Core\Services\User;

use Modules\Core\Contracts\Services\FindUserByIdentifierInterface;
use Modules\Core\Enums\IdentifierType;
use Modules\User\Models\Client;
use Modules\User\Models\Staff;
use Modules\User\Models\User;

class FindUserByNationalCode implements FindUserByIdentifierInterface
{

    public function get(string $identifier): ?User
    {
        $column=IdentifierType::NATIONAL_CODE->value;

        return Client::where($column, $identifier)->first()?->user
            ?? Staff::where($column, $identifier)->first()?->user;
    }
}
