<?php

namespace Modules\User\Tests\Feature\Controllers\Api\V1\Admin;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Log;
use Modules\User\Models\Admin;
use Modules\User\Models\User;
use Tests\TestCase;

class AdminControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected $rootRoute = 'api.v1.admin.';


    /** @test */
    public function it_get_admin_list()
    {
        $user = User::factory()->create([
            'phone' => '09123456789',
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
        ]);

        $payload = [
            'user_id'=>$user->id,
        ];

        Admin::factory()->create($payload);

        $response = $this->getJson(route($this->rootRoute . 'admins.index'));
        $response->assertStatus(200)
            ->assertJsonIsObject('meta');
    }
    /** @test */
    public function it_creates_admin_successfully()
    {
        $user = User::factory()->create();

        $payload = [
            'phone' => '09123456789',
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
            'is_active' => 1,
        ];

        $response = $this->postJson(route($this->rootRoute . 'admins.store'), $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'phone' => '09123456789',
                'first_name' => 'Ali',
                'last_name' => 'Ahmadi',
            ]);

        $this->assertDatabaseHas('users', ['phone' => '09123456789']);
    }

    /** @test */
    public function it_fails_when_phone_is_duplicate()
    {
        $existingUser = User::factory()->create(['phone' => '09123456789']);

        $payload = [
            'phone' => '09123456789', // تکراری
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
        ];

        $response = $this->postJson(route($this->rootRoute . 'admins.store'), $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    /** @test */
    public function it_allows_when_phone_is_duplicate_for_unrelated_user()
    {
        $existingUser = User::factory()->create(['phone' => '09123456789']);

        $payload = [
            'create_for_user' => $existingUser->id,
            'phone' => '09123456789', // تکراری
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
        ];

        $response = $this->postJson(route($this->rootRoute . 'admins.store'), $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'phone' => '09123456789',
                'first_name' => 'Ali',
                'last_name' => 'Ahmadi',
            ]);
        $this->assertDatabaseHas('admins', [
            'user_id' => $existingUser->id
        ]);

    }

    /** @test */
    public function it_updates_admin_successfully()
    {
        $user = User::factory()->create(['phone' => '09121111111']);
        $admin = Admin::factory()->create(['user_id' => $user->id]);

        $payload = [
            'phone' => '09121111111', // همان شماره قبلی
            'first_name' => 'UpdatedFirst',
            'last_name' => 'UpdatedLast',
        ];

        $response = $this->putJson(route($this->rootRoute . 'admins.update', $admin->id), $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'first_name' => 'UpdatedFirst',
                'last_name' => 'UpdatedLast',
            ]);

        $this->assertDatabaseHas('admins', ['id' => $admin->id]);
    }

    /** @test */
    public function it_deletes_admin_successfully()
    {
        $user = User::factory()->create();
        $admin = Admin::factory()->create(['user_id' => $user->id]);

        $response = $this->deleteJson(route($this->rootRoute . 'admins.destroy', $admin->id));

        $response->assertStatus(204);
        $this->assertDatabaseMissing('admins', ['id' => $admin->id]);
    }
}
