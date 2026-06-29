<?php

namespace Modules\Core\Contracts\Services;

use Modules\User\Models\User;

interface FindUserByIdentifierInterface
{
    public function get(string $identifier): ?User;
}
