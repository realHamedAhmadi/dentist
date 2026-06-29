<?php

namespace Modules\User\Tests\Feature\Controllers\Api\V1\Admin;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Modules\User\Models\Definition\Specialty;
use Modules\User\Models\User;
use Modules\User\Models\Expert;
use Tests\TestCase;

class ExpertControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected $rootRoute = 'api.v1.admin.';

    /** @test */
    public function it_creates_expert_successfully()
    {
        $user = User::factory()->create();
        $specialty = Specialty::factory()->create();

        $payload = [
            'phone' => '09123456789',
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
            'license_number' => '12345',
            'is_active' => 1,
            'specialties' => [
                [
                    'id' => $specialty->id,
                    'share_type' => 'percentage',
                    'share_value' => 50,
                ]
            ],
        ];

        $response = $this->postJson(route($this->rootRoute.'experts.store'), $payload);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'phone' => '09123456789',
                'first_name' => 'Ali',
                'last_name' => 'Ahmadi',
            ]);

        $this->assertDatabaseHas('users', ['phone' => '09123456789']);
        $this->assertDatabaseHas('experts', ['license_number' => '12345']);
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

        $response = $this->postJson(route($this->rootRoute.'experts.store'), $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    /** @test */
    public function it_caps_percentage_share_value_to_100()
    {
        $specialty = Specialty::factory()->create();

        $payload = [
            'phone' => '09121234567',
            'first_name' => 'Sara',
            'last_name' => 'Karimi',
            'specialties' => [
                [
                    'id' => $specialty->id,
                    'share_type' => 'percentage',
                    'share_value' => 150, // بیش از 100
                ]
            ],
        ];

        $response = $this->postJson(route($this->rootRoute.'experts.store'), $payload);

        $response->assertStatus(200);

        $expert = Expert::whereHas('user', fn($q) => $q->where('phone', '09121234567'))->firstOrFail();
        $this->assertLessThanOrEqual(100, $expert->specialties()->first()->pivot->share_value);
    }

    /** @test */
    public function it_updates_expert_successfully()
    {
        $user = User::factory()->create(['phone' => '09121111111']);
        $expert = Expert::factory()->create(['user_id' => $user->id]);
        $specialty = Specialty::factory()->create();

        $payload = [
            'phone' => '09121111111', // همان شماره قبلی
            'first_name' => 'UpdatedFirst',
            'last_name' => 'UpdatedLast',
            'specialties' => [
                [
                    'id' => $specialty->id,
                    'share_type' => 'percentage',
                    'share_value' => 80,
                ]
            ],
        ];

        $response = $this->putJson(route($this->rootRoute.'experts.update', $expert->id), $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'first_name' => 'UpdatedFirst',
                'last_name' => 'UpdatedLast',
            ]);

        $this->assertDatabaseHas('experts', ['id' => $expert->id]);
    }

    /** @test */
    public function it_deletes_expert_successfully()
    {
        $user = User::factory()->create();
        $expert = Expert::factory()->create(['user_id' => $user->id]);

        $response = $this->deleteJson(route($this->rootRoute.'experts.destroy', $expert->id));

        $response->assertStatus(204);
        $this->assertDatabaseMissing('experts', ['id' => $expert->id]);
    }
}
