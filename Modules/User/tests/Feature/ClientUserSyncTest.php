<?php

namespace Modules\User\Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Modules\User\Models\Client;
use Modules\User\Models\User;
use Tests\TestCase;

class ClientUserSyncTest extends TestCase
{
    use DatabaseTransactions;

    public function test_updating_user_updates_client()
    {
        $user = User::factory()->create([
            'phone' => '09216549800',
            'first_name' => 'hamed',
            'last_name' => 'hassani',
        ]);
        $client = Client::factory()->create([
            'user_id' => $user->id,
            'first_name' => 'hamed',
            'last_name' => 'hassani',
            'phone' => $user->phone,
        ]);

        // تغییر نام یوزر
        $user->update([
            'first_name' => 'hamed_',
            'last_name' => 'hassani_',
            'phone' => '09216549801',
        ]);

        $this->assertEquals('09216549801', $user->fresh()->phone);
        $this->assertEquals('09216549801', $client->fresh()->phone);
        $this->assertEquals('hamed_', $user->fresh()->first_name);
        $this->assertEquals('hamed_', $client->fresh()->first_name);
        $this->assertEquals('hassani_', $user->fresh()->last_name);
        $this->assertEquals('hassani_', $client->fresh()->last_name);
    }
}
