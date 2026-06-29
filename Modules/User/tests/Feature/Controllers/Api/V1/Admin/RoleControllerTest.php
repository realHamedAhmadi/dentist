<?php

namespace Modules\User\Tests\Feature\Controllers\Api\V1\Admin;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Modules\User\Models\Definition\Role;
use Tests\TestCase;

class RoleControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected string $baseRoute = 'api.v1.admin.roles.';

    /** @test */
    public function index_returns_paginated_list()
    {
        Role::factory()->count(5)->create();

        $response = $this->getJson(route($this->baseRoute.'index'));

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'links', 'meta']);
    }

    /** @test */
    public function store_creates_role_successfully()
    {
        $data = [
            'name'  => 'AdminRole',
            'title' => 'Administrator'
        ];

        $response = $this->postJson(route($this->baseRoute.'store'), $data);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'AdminRole');
    }

    /** @test */
    public function show_returns_record()
    {
        $record = Role::factory()->create();

        $response = $this->getJson(route($this->baseRoute.'show', $record->id));

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $record->id);
    }

    /** @test */
    public function update_updates_record_successfully()
    {
        $role = Role::factory()->create([
            'name' => 'OldRole'
        ]);

        $data = [
            'name' => 'NewRole'
        ];

        $response = $this->putJson(route($this->baseRoute.'update', $role->id), $data);

        $response->assertStatus(200);
    }

    /** @test */
    public function update_allows_missing_fields_because_sometimes()
    {
        $role = Role::factory()->create([
            'name' => 'SomeRole'
        ]);

        // هیچ فیلدی ارسال نمی‌شود
        $response = $this->putJson(route($this->baseRoute.'update', $role->id), []);

        $response->assertStatus(200);
        $this->assertDatabaseHas('roles',[
            'id'=>$role->id,
            'name'=>'SomeRole',
        ]);
    }

    /** @test */
    public function update_fails_when_name_is_invalid()
    {
        $role = Role::factory()->create();

        $response = $this->putJson(route($this->baseRoute.'update', $role->id), [
            'name' => 'ادمین'
        ]);

        $response->assertStatus(422);
    }

    /** @test */
    public function it_deletes_a_record_successfully()
    {
        $role = Role::factory()->create(['name'=>'role']);

        $response = $this->deleteJson(route($this->baseRoute.'destroy', $role->id));

        $response->assertStatus(204);
    }
}

