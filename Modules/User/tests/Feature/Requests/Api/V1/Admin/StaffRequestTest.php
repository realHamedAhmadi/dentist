<?php

namespace Modules\User\Tests\Feature\Requests\Api\V1\Admin;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Modules\Core\Models\DevSetting;
use Modules\User\Http\Requests\Api\V1\Admin\OwnerRequest;
use Modules\User\Http\Requests\Api\V1\Admin\StaffRequest;
use Modules\User\Http\Resources\Api\V1\Admin\UserResource;
use Modules\User\Models\Staff;
use Modules\User\Models\User;
use Tests\TestCase;

class StaffRequestTest extends TestCase
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
        $this->assertArrayHasKey('position_id',trans($attr));
        $this->assertArrayHasKey('shift_id',trans($attr));
        $this->assertArrayHasKey('contract_type_id',trans($attr));
        $this->assertArrayHasKey('national_code',trans($attr));
        $this->assertArrayHasKey('is_active',trans($attr));
        $this->assertArrayHasKey('hire_date',trans($attr));
        $this->assertArrayHasKey('end_date',trans($attr));
        $this->assertArrayHasKey('address',trans($attr));
        $this->assertArrayHasKey('phone',trans($attr));
        $this->assertArrayHasKey('employee_code',trans($attr));
    }

    /** @test */
    public function it_not_passed_with_id_or_user_id()
    {
        $data = [
            'id'=>1, 'user_id'=>5
        ];

        $request = new StaffRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertArrayHasKey('id', $validator->errors()->toArray());
        $this->assertArrayHasKey('user_id', $validator->errors()->toArray());
    }

    /** @test */
    public function it_accepts_valid_create_request()
    {
        $payload = [
            'first_name' => 'Ali',
            'last_name' => 'Rezaei',
            'phone' => '09123456789',
            'employee_code' => 'EMP001',
            'hire_date' => '1404-07-22', // شمسی
            'end_date' => '1404-12-29',  // شمسی
        ];

        $response = $this->postJson(route($this->rootRoute.'staff.store'), $payload);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => ['id', 'first_name', 'last_name', 'phone', 'hire_date', 'end_date']
            ])->assertJsonFragment(['hire_date'=>'1404-07-22']);

        $this->assertDatabaseHas('users', [
            'first_name' => 'Ali',
            'last_name' => 'Rezaei',
        ]);
    }

    /** @test */
    public function it_fails_when_hire_date_is_invalid()
    {
        $payload = [
            'first_name' => 'Ali',
            'last_name' => 'Rezaei',
            'phone' => '09123456789',
            'hire_date' => 'invalid-date',
        ];

        $response = $this->postJson(route($this->rootRoute.'staff.store'), $payload);

        $response->assertStatus(422);

        $response->assertJsonValidationErrors(['hire_date']);
    }

    /** @test */
    public function it_allows_update_with_same_phone()
    {
        $user = User::factory()->create(['phone' => '09123456789']);
        $staff = Staff::factory()->create(['user_id' => $user->id]);

        $payload = [
            'first_name' => 'Ali',
            'last_name' => 'Rezaei',
            'phone' => '09123456789', // همان شماره
        ];

        $response = $this->putJson(route($this->rootRoute.'staff.update',$staff->id), $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', ['id' => $staff->user_id, 'first_name' => 'Ali']);
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

        $response = $this->postJson(route($this->rootRoute.'staff.store'), $payload);
        $response->assertStatus(422);
        $this->assertArrayHasKey('unrelated_user',$response->json('extra'));
    }
}
