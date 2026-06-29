<?php

namespace Modules\User\Tests\Feature\Models;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Modules\User\Models\Admin;
use Modules\User\Models\Client;
use Modules\User\Models\User;
use Tests\TestCase;

class UserTest extends TestCase
{
    use DatabaseTransactions;
    /**
     * A basic test example.
     */
    protected string $modelClass=User::class;

    function test_full_name()
    {
        $record=$this->modelClass::factory()->create([
            'first_name'=>'hamed',
            'last_name'=>'ahmadi',
        ]);

        $this->assertEquals('Hamed Ahmadi',$record->full_name);
    }

    function test_password_attr()
    {
        $record=$this->modelClass::factory()->create([
            'first_name'=>'hamed',
            'last_name'=>'ahmadi',
            'password'=>'secret',
        ]);

        $this->assertTrue(Hash::check('secret',$record->password));
    }

    function test_is_active_attr()
    {
        $record=$this->modelClass::factory()->create([
            'first_name'=>'hamed',
            'last_name'=>'ahmadi',
        ]);

        Admin::factory()->create([
            'user_id'=>$record->id
        ]);

        $this->assertTrue($record->is_active);
    }
}
