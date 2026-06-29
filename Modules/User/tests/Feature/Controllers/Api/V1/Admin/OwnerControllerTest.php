<?php

namespace Modules\User\Tests\Feature\Controllers\Api\V1\Admin;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Modules\User\Models\Definition\Specialty;
use Modules\User\Models\Owner;
use Modules\User\Models\User;
use Tests\TestCase;

class OwnerControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected $rootRoute = 'api.v1.admin.';

    /** @test */
    public function it_creates_owner_successfully()
    {
        $user = User::factory()->create();
        $payload = [
            'phone' => '09123456789',
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
            'national_code' => '1234567891',
            'is_active' => 1,
            'share_type'=>'percentage',
            'share_value'=>90
        ];

        $response = $this->postJson(route($this->rootRoute.'owners.store'), $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'phone' => '09123456789',
                'first_name' => 'Ali',
                'last_name' => 'Ahmadi',
            ]);

        $this->assertDatabaseHas('users', ['phone' => '09123456789']);
        $this->assertDatabaseHas('owners', ['national_code' => '1234567891']);
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

        $response = $this->postJson(route($this->rootRoute.'owners.store'), $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    /** @test */
    public function it_updates_owner_successfully()
    {
        $user = User::factory()->create(['phone' => '09121111111']);
        $owner = Owner::factory()->create([
            'user_id' => $user->id,
            'national_code'=>'1234567891',
        ]);
        $payload = [
            'phone' => '09121111111', // همان شماره قبلی
            'first_name' => 'UpdatedFirst',
            'last_name' => 'UpdatedLast',
        ];

        $response = $this->putJson(route($this->rootRoute.'owners.update', $owner->id), $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'first_name' => 'UpdatedFirst',
                'last_name' => 'UpdatedLast',
            ]);

        $this->assertDatabaseHas('owners', [
            'id' => $owner->id,
            'national_code'=>'1234567891',
        ]);
    }

    /** @test */
    public function it_deletes_owner_successfully()
    {
        $user = User::factory()->create();
        $owner = Owner::factory()->create(['user_id' => $user->id]);

        $response = $this->deleteJson(route($this->rootRoute.'owners.destroy', $owner->id));

        $response->assertStatus(204);
        $this->assertDatabaseMissing('owners', ['id' => $owner->id]);
    }

    /** @test */
    public function test_it_has_unrelated_user_data_in_response_when_phone_repeat()
    {
        $user = User::factory()->create(['phone' => '09123456789']);
        $payload = [
            'first_name' => 'Ali',
            'last_name' => 'Rezaei',
            'phone' => '09123456789', // همان شماره
        ];

        $response = $this->postJson(route($this->rootRoute.'owners.store'), $payload);
        $response->assertStatus(422);
        $this->assertArrayHasKey('unrelated_user',$response->json('extra'));
    }
}
