<?php

namespace Modules\User\Tests\Feature\Requests\Api\V1\Admin;


namespace Modules\User\Tests\Feature\Requests\Api\V1\Admin;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Modules\User\Models\Definition\Role;

class RoleRequestTest extends TestCase
{
    use DatabaseTransactions;

    protected string $baseRoute = 'api.v1.admin.roles.';


    public function test_exists_fields_in_lang()
    {
        $this->app->setLocale('fa');
        $attr='validation.attributes';
        $this->assertIsArray(trans($attr));
        $this->assertArrayHasKey('name',trans($attr));
        $this->assertArrayHasKey('title',trans($attr));
    }

    /** @test */
    public function create_fails_when_name_is_missing()
    {
        $response = $this->postJson(route($this->baseRoute . 'store'), []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function create_fails_when_name_is_too_short()
    {
        $response = $this->postJson(route($this->baseRoute . 'store'), [
            'name' => 'ab'
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function create_fails_when_name_is_not_unique()
    {
        $role = Role::factory()->create(['name' => 'manager']);

        $response = $this->postJson(route($this->baseRoute . 'store'), [
            'name' => 'manager'
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function create_fails_when_name_is_unique()
    {
        $role = Role::factory()->create(['name' => 'manager']);

        $response = $this->putJson(route($this->baseRoute . 'update',$role->id), [
            'name' => 'manager'
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function create_passes_with_valid_data()
    {
        $response = $this->postJson(route($this->baseRoute . 'store'), [
            'name' => 'editor',
            'title' => 'Editor'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('roles', ['name' => 'editor']);
    }

    /** @test */
    public function update_allows_missing_fields_because_sometimes()
    {
        $role = Role::factory()->create(['name' => 'Old Name', 'title' => 'Old Title']);

        $response = $this->putJson(route($this->baseRoute . 'update', $role->id), []);

        $response->assertStatus(200);
    }

    /** @test */
    public function update_fails_when_name_is_invalid()
    {
        $role = Role::factory()->create(['name' => 'ValidName']);

        $response = $this->putJson(route($this->baseRoute . 'update', $role->id), [
            'name' => 'آدمین'
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }


    /** @test */
    public function update_passes_and_title_is_set_from_name_if_empty()
    {
        $role = Role::factory()->create(['name' => 'OldName', 'title' => 'OldTitle']);

        $response = $this->putJson(route($this->baseRoute . 'update', $role->id), [
            'name' => 'NewName',
            'title' => null
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('roles', [
            'id' => $role->id,
            'name' => 'NewName',
            'title' => null
        ]);

        $response = $this->putJson(route($this->baseRoute . 'update', $role->id), [
            'name' => 'NewName',
            'title' => ''
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('roles', [
            'id' => $role->id,
            'name' => 'NewName',
            'title' => ''
        ]);
    }

    /** @test */
    public function id_field_is_prohibited_on_create()
    {
        $response = $this->postJson(route($this->baseRoute . 'store'), [
            'id' => 55,
            'name' => 'SomeName'
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['id']);
    }
}
