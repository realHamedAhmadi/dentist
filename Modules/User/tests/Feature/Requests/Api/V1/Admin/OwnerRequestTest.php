<?php

namespace Modules\User\Tests\Feature\Reqeusts\Api\V1\Admin;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Validator;
use Modules\User\Enums\ShareType;
use Modules\User\Http\Requests\Api\V1\Admin\ExpertRequest;
use Modules\User\Http\Requests\Api\V1\Admin\OwnerRequest;
use Modules\User\Models\Definition\Specialty;
use Modules\User\Models\Expert;
use Modules\User\Models\User;
use Tests\TestCase;

class OwnerRequestTest extends TestCase
{
    use DatabaseTransactions;
    protected $rootRoute='api.v1.admin.';

    public function test_exists_fields_in_lang()
    {
        $this->app->setLocale('fa');
        $attr='validation.attributes';
        $this->assertIsArray(trans($attr));
        $this->assertArrayHasKey('first_name',trans($attr));
        $this->assertArrayHasKey('last_name',trans($attr));
        $this->assertArrayHasKey('is_active',trans($attr));
        $this->assertArrayHasKey('national_code',trans($attr));
        $this->assertArrayHasKey('address',trans($attr));
        $this->assertArrayHasKey('phone',trans($attr));
        $this->assertArrayHasKey('share_type',trans($attr));
        $this->assertArrayHasKey('share_value',trans($attr));
    }


    /** @test */
    public function it_not_passed_with_id_or_user_id()
    {
        $data = [
            'id'=>1, 'user_id'=>5
        ];

        $request = new OwnerRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertArrayHasKey('id', $validator->errors()->toArray());
        $this->assertArrayHasKey('user_id', $validator->errors()->toArray());
    }

    /** @test */
    public function it_passes_with_valid_data()
    {
        $data = [
            'phone' => '09123456789',
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
            'license_number' => '12345',
            'is_active' => 1,
            'share_type' => 'percentage',
            'share_value' => 20,
        ];

        $request = new ExpertRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->fails(), $validator->errors()->toJson());
    }

    /** @test */
    public function it_passes_when_percentage_value_is_between_0_and_100()
    {
        $data = [
            'phone' => '09123456789',
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
            'share_type' => ShareType::PERCENTAGE->value,
            'share_value' => 50,
        ];

        $validator = Validator::make($data, (new ExpertRequest())->rules());

        $this->assertFalse($validator->fails(), $validator->errors()->toJson());
    }

    /** @test */
    public function it_fails_when_percentage_value_is_more_than_100()
    {
        $data = [
            'phone' => '09123456789',
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
            'share_type' => ShareType::PERCENTAGE->value,
            'share_value' => 150,
        ];

        $res=$this->postJson(route($this->rootRoute.'owners.store'),$data);

        $res->assertStatus(422)
            ->assertJsonValidationErrors(['share_value']);
    }

    /** @test */
    public function it_passes_when_share_type_is_not_percentage_even_with_large_value()
    {
        $data = [
            'phone' => '09123456789',
            'first_name' => 'Ali',
            'last_name' => 'Ahmadi',
            'share_type' => ShareType::FIXED->value,
            'share_value' => 10000,
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
}
