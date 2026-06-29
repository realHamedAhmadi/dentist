<?php

namespace Modules\User\Tests\Feature\Requests\Api\V1\Admin;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Modules\Core\Models\DevSetting;
use Modules\User\Http\Requests\Api\V1\Admin\OwnerRequest;
use Modules\User\Http\Requests\Api\V1\Admin\AdminRequest;
use Modules\User\Http\Resources\Api\V1\Admin\UserResource;
use Modules\User\Models\Admin;
use Modules\User\Models\Definition\Role;
use Modules\User\Models\User;
use Tests\TestCase;

class AdminRequestTest extends TestCase
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
        $this->assertArrayHasKey('phone',trans($attr));
        $this->assertArrayHasKey('roles',trans($attr));
    }

    /** @test */
    public function it_not_passed_with_id_or_user_id()
    {
        $data = [
            'id'=>1, 'user_id'=>5
        ];

        $request = new AdminRequest();
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
        ];

        $response = $this->postJson(route($this->rootRoute.'admins.store'), $payload);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => ['id', 'first_name', 'last_name', 'phone']
            ]);

        $this->assertDatabaseHas('users', [
            'first_name' => 'Ali',
            'last_name' => 'Rezaei',
        ]);
    }

    /** @test */
    public function it_allows_update_with_same_phone()
    {
        $user = User::factory()->create(['phone' => '09123456789']);
        $admin = Admin::factory()->create(['user_id' => $user->id]);

        $payload = [
            'first_name' => 'Ali',
            'last_name' => 'Rezaei',
            'phone' => '09123456789', // همان شماره
        ];

        $response = $this->putJson(route($this->rootRoute.'admins.update',$admin->id), $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', ['id' => $admin->user_id, 'first_name' => 'Ali']);
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

        $response = $this->postJson(route($this->rootRoute.'admins.store'), $payload);
        $response->assertStatus(422);
        $this->assertArrayHasKey('unrelated_user',$response->json('extra'));
    }


    public function test_it_fails_when_roles_value_does_not_exist()
    {
        $payload = [
            'first_name' => 'Ali',
            'last_name' => 'Rezaei',
            'phone' => '09123456789',
            'roles' => ['invalid-role'], // نقشی که وجود ندارد
        ];
        $response = $this->postJson(route($this->rootRoute.'admins.store'), $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['roles']);
    }

    public function test_it_passes_when_roles_value_exists()
    {
        // ساخت یک نقش معتبر
        $role = Role::query()->create(['name' => 'manager']);
        $payload = [
            'first_name' => 'Ali',
            'last_name' => 'Rezaei',
            'phone' => '09123456789', // همان شماره
            'roles' => [ $role->name]
        ];
        $response = $this->postJson(route($this->rootRoute.'admins.store'), $payload);

        $response->assertStatus(200);
        $response->assertJsonMissingValidationErrors(['roles']);
    }

}
