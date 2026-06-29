<?php

namespace Modules\User\Tests\Feature\Controllers\Api\V1\Admin;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Modules\User\Models\Staff;
use Modules\User\Models\User;
use Tests\TestCase;

class StaffControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected $rootRoute = 'api.v1.admin.';

    /** @test */
    public function it_creates_staff_successfully()
    {
        $user = User::factory()->create();

        $payload = [
            'phone' => '09123456789',
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
            'national_code'=>'1234567891',
            'is_active' => 1,
        ];

        $response = $this->postJson(route($this->rootRoute.'staff.store'), $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'phone' => '09123456789',
                'first_name' => 'Ali',
                'last_name' => 'Ahmadi',
            ]);

        $this->assertDatabaseHas('users', ['phone' => '09123456789']);
        $this->assertDatabaseHas('staff', ['national_code' => '1234567891']);
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

        $response = $this->postJson(route($this->rootRoute.'staff.store'), $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    /** @test */
    public function it_allows_when_phone_is_duplicate_for_unrelated_user()
    {
        $existingUser = User::factory()->create(['phone' => '09123456789']);

        $payload = [
            'create_for_user'=>$existingUser->id,
            'phone' => '09123456789', // تکراری
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
        ];

        $response = $this->postJson(route($this->rootRoute.'staff.store'), $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'phone' => '09123456789',
                'first_name' => 'Ali',
                'last_name' => 'Ahmadi',
            ]);
        $this->assertDatabaseHas('staff',[
            'user_id'=>$existingUser->id
        ]);

    }
    /** @test */
    public function it_updates_staff_successfully()
    {
        $user = User::factory()->create(['phone' => '09121111111']);
        $staff = Staff::factory()->create(['user_id' => $user->id]);

        $payload = [
            'phone' => '09121111111', // همان شماره قبلی
            'first_name' => 'UpdatedFirst',
            'last_name' => 'UpdatedLast',
        ];

        $response = $this->putJson(route($this->rootRoute.'staff.update', $staff->id), $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'first_name' => 'UpdatedFirst',
                'last_name' => 'UpdatedLast',
            ]);

        $this->assertDatabaseHas('staff', ['id' => $staff->id]);
    }

    /** @test */
    public function it_deletes_staff_successfully()
    {
        $user = User::factory()->create();
        $staff = Staff::factory()->create(['user_id' => $user->id]);

        $response = $this->deleteJson(route($this->rootRoute.'staff.destroy', $staff->id));

        $response->assertStatus(204);
        $this->assertDatabaseMissing('staff', ['id' => $staff->id]);
    }
}
