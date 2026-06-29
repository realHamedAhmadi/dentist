<?php

namespace Modules\Auth\Contracts;

use Modules\User\Models\User;

interface LoginPolicyInterface
{
    public function authorize(User $user):void;
}
