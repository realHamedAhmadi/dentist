<?php

namespace Modules\User\Tests\Feature\Reqeusts\Api\V1\Admin;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Validator;
use Modules\User\Enums\ShareType;
use Modules\User\Http\Requests\Api\V1\Admin\ExpertRequest;
use Modules\User\Models\Definition\Specialty;
use Modules\User\Models\Expert;
use Modules\User\Models\User;
use Tests\TestCase;

class ExpertRequestTest extends TestCase
{
    use DatabaseTransactions;

    protected string $rootRoute='api.v1.admin.';

    public function test_exists_fields_in_lang()
    {
        $this->app->setLocale('fa');
        $attr='validation.attributes';
        $this->assertIsArray(trans($attr));
        $this->assertArrayHasKey('first_name',trans($attr));
        $this->assertArrayHasKey('last_name',trans($attr));
        $this->assertArrayHasKey('is_active',trans($attr));
        $this->assertArrayHasKey('address',trans($attr));
        $this->assertArrayHasKey('specialties',trans($attr));
        $this->assertArrayHasKey('specialties.*.id',trans($attr));
        $this->assertArrayHasKey('specialties.*.share_type',trans($attr));
        $this->assertArrayHasKey('specialties.*.share_value',trans($attr));
        $this->assertArrayHasKey('expert_weekly_schedules',trans($attr));
        $this->assertArrayHasKey('expert_weekly_schedules.*.day',trans($attr));
        $this->assertArrayHasKey('expert_weekly_schedules.*.starts_at',trans($attr));
        $this->assertArrayHasKey('expert_weekly_schedules.*.ends_at',trans($attr));
        $this->assertArrayHasKey('phone',trans($attr));
        $this->assertArrayHasKey('license_number',trans($attr));
    }

    /** @test */
    public function it_not_passed_with_id_or_user_id()
    {
        $data = [
            'id'=>1, 'user_id'=>5
        ];

        $request = new ExpertRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertArrayHasKey('id', $validator->errors()->toArray());
        $this->assertArrayHasKey('user_id', $validator->errors()->toArray());
    }

    /** @test */
    public function it_passes_with_valid_data()
    {
        $specialty = Specialty::factory()->create();

        $data = [
            'phone' => '09123456789',
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
            'license_number' => '12345',
            'is_active' => 1,
            'specialties' => [
                [
                    'id' => $specialty->id,
                    'share_type' => 'percentage',
                    'share_value' => 20,
                ],
            ],
        ];

        $request = new ExpertRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->fails(), $validator->errors()->toJson());
    }

    /** @test */
    public function it_fails_if_specialty_id_is_invalid()
    {
        $data = [
            'phone' => '09123456789',
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
            'specialties' => [
                ['id' => 9999, 'share_value' => 10],
            ],
        ];

        $request = new ExpertRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('specialties.0.id', $validator->errors()->toArray());
    }

    /** @test */
    public function it_requires_share_value_when_id_is_present()
    {
        $specialty = Specialty::factory()->create();

        $data = [
            'phone' => '09123456789',
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
            'specialties' => [
                ['id' => $specialty->id],
                [
                    'id' => $specialty->id,
                    'share_type' => ShareType::PERCENTAGE->value,
                    'share_value' => 50,
                ],
            ],
        ];

        $request = new ExpertRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('specialties.0.share_value', $validator->errors()->toArray());
    }

    /** @test */
    public function it_passes_when_percentage_value_is_between_0_and_100()
    {
        $specialty = Specialty::factory()->create();

        $data = [
            'phone' => '09123456789',
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
            'specialties' => [
                [
                    'id' => $specialty->id,
                    'share_type' => ShareType::PERCENTAGE->value,
                    'share_value' => 50,
                ],
            ],
        ];

        $validator = Validator::make($data, (new ExpertRequest())->rules());

        $this->assertFalse($validator->fails(), $validator->errors()->toJson());
    }

    /** @test */
    public function it_fails_when_percentage_value_is_more_than_100()
    {
        $specialty = Specialty::factory()->create();

        $data = [
            'phone' => '09123456789',
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
            'specialties' => [
                [
                    'id' => $specialty->id,
                    'share_type' => ShareType::PERCENTAGE->value,
                    'share_value' => 150,
                ],
            ],
        ];
        $request = new ExpertRequest();
        $request->merge($data);

        $request->setContainer(app()); // 🔑 خیلی مهم

        $request->validateResolved();

        $validated=$request->validated();

        $this->assertEquals(100, $validated['specialties'][0]['share_value']);

    }

    /** @test */
    public function it_passes_when_share_type_is_not_percentage_even_with_large_value()
    {
        $specialty = Specialty::factory()->create();

        $data = [
            'phone' => '09123456789',
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
            'specialties' => [
                [
                    'id' => $specialty->id,
                    'share_type' => ShareType::FIXED->value,
                    'share_value' => 10000,
                ],
            ],
        ];

        $validator = Validator::make($data, (new ExpertRequest())->rules());

        $this->assertFalse($validator->fails(), $validator->errors()->toJson());
    }

    /** @test */
    public function it_requires_unique_phone_when_creating_new_expert()
    {
        // Arrange
        User::factory()->create(['phone' => '09120000000']);

        $request = new ExpertRequest([], [], [], [], [], ['REQUEST_METHOD' => 'POST']);
        $rules = $request->rules();

        // Act
        $validator = Validator::make([
            'phone' => '09120000000',
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
        ], $rules);

        // Assert
        $this->assertTrue($validator->fails(), 'Validator should fail for duplicate phone on create.');
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

        $response = $this->postJson(route($this->rootRoute.'experts.store'), $payload);
        $response->assertStatus(422);
        $this->assertArrayHasKey('unrelated_user',$response->json('extra'));
    }


    /** @test */
    public function it_passes_validation_with_valid_weekly_schedule()
    {
        $payload = [
            'first_name' => 'Ali',
            'last_name' => 'Rezaei',
            'phone' => '09123456789',
            'expert_weekly_schedules' => [
                [
                    'day' => 2, // دوشنبه
                    'starts_at' => 8,
                    'ends_at' => 16,
                ],
            ],
        ];

        $response = $this->postJson(route($this->rootRoute.'experts.store'), $payload);
        $response->assertStatus(200); // یا هر استاتوس مورد انتظار
    }

    /** @test */
    public function it_fails_when_day_is_out_of_range()
    {
        $payload = [
            'first_name' => 'Ali',
            'last_name' => 'Rezaei',
            'phone' => '09123456789',
            'expert_weekly_schedules' => [
                [
                    'day' => 10, // غیرمجاز
                    'starts_at' => 8,
                    'ends_at' => 16,
                ],
            ],
        ];

        $response = $this->postJson(route($this->rootRoute.'experts.store'), $payload);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['expert_weekly_schedules.0.day']);
    }

    /** @test */
    public function it_requires_start_and_end_when_day_is_present()
    {
        $payload = [
            'first_name' => 'Ali',
            'last_name' => 'Rezaei',
            'phone' => '09123456789',
            'expert_weekly_schedules' => [
                [
                    'day' => 3,
                    // starts_at و ends_at عمداً خالی‌اند
                ],
            ],
        ];

        $response = $this->postJson(route($this->rootRoute.'experts.store'), $payload);
        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'expert_weekly_schedules.0.starts_at',
                'expert_weekly_schedules.0.ends_at',
            ]);
    }

    /** @test */
    public function it_fails_when_hours_are_out_of_range()
    {
        $payload = [
            'first_name' => 'Ali',
            'last_name' => 'Rezaei',
            'phone' => '09123456789',
            'expert_weekly_schedules' => [
                [
                    'day' => 4,
                    'starts_at' => 25,
                    'ends_at' => -1,
                ],
            ],
        ];

        $response = $this->postJson(route($this->rootRoute.'experts.store'), $payload);
        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'expert_weekly_schedules.0.starts_at',
                'expert_weekly_schedules.0.ends_at',
            ]);
    }
}
