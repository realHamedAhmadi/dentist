<?php

namespace Modules\Auth\Policies;

use Modules\Auth\Contracts\LoginPolicyInterface;
use Modules\Auth\Exceptions\AuthenticationDeniedException;
use Modules\User\Exceptions\UserAccountBannedException;
use Modules\User\Exceptions\UserAccountDisabledException;
use Modules\User\Models\User;

class LoginPolicy implements LoginPolicyInterface
{
    public function authorize(User $user):void
    {
        if (! $user->is_active){
            throw new UserAccountDisabledException();
        }

        if ($user->is_suspended){
            throw new AuthenticationDeniedException();
        }

        if ($user->is_banned){
            throw new UserAccountBannedException();
        }
    }
}
