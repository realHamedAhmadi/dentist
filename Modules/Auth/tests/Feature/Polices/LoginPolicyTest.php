<?php

namespace Modules\Auth\Tests\Feature\Services;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Modules\Auth\Exceptions\AuthenticationDeniedException;
use Modules\Auth\Policies\LoginPolicy;
use Modules\User\Exceptions\UserAccountBannedException;
use Modules\User\Exceptions\UserAccountDisabledException;
use Modules\User\Models\Admin;
use Modules\User\Models\User;
use Tests\TestCase;

class LoginPolicyTest extends TestCase
{
    use DatabaseTransactions;

    public function testUserIsActive()
    {
        $user=User::factory()->create();
        Admin::factory()->create([
            'user_id'=>$user->id,
        ]);
        (new LoginPolicy())->authorize($user);
        $this->assertTrue(true);
    }

    public function testUserIsDisabled()
    {
        $user=User::factory()->create();
        Admin::factory()->create([
            'user_id'=>$user->id,
            'is_active'=>false
        ]);
        $this->expectException(UserAccountDisabledException::class);
        (new LoginPolicy())->authorize($user);
        $this->assertTrue(true);
    }


    public function testUserIsSuspended()
    {
        $user=User::factory()->create();
        Admin::factory()->create([
            'user_id'=>$user->id,
        ]);
        $user->is_suspended=true;
        $this->expectException(AuthenticationDeniedException::class);
        (new LoginPolicy())->authorize($user);
        $this->assertTrue(true);
    }


    public function testUserBanned()
    {
        $user=User::factory()->create();
        Admin::factory()->create([
            'user_id'=>$user->id,
        ]);
        $user->is_banned=true;
        $this->expectException(UserAccountBannedException::class);
        (new LoginPolicy())->authorize($user);
        $this->assertTrue(true);
    }
}
