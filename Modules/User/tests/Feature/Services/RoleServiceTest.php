<?php

namespace Modules\User\Tests\Feature\Services;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Modules\User\Services\RoleService;
use Tests\TestCase;
use Modules\User\Models\User;
use Modules\User\Models\Definition\Role;
use RuntimeException;

class RoleServiceTest extends TestCase
{
    use DatabaseTransactions;

    protected RoleService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new \Modules\User\Services\RoleService();
    }

    /** @test */
    public function can_create_role_with_valid_data()
    {
        $role = $this->service->create([
            'name' => 'manager',
            'title' => 'Manager',
            'guard_name' => 'api'
        ]);

        $this->assertInstanceOf(Role::class, $role);
        $this->assertDatabaseHas('roles', ['name' => 'manager']);
    }

    /** @test */
    public function create_fails_if_name_contains_non_english_characters()
    {
        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('The name field contains non-English characters.');

        $this->service->create(['name' => 'مدیر']);
    }

    /** @test */
    public function create_fails_if_name_is_not_unique()
    {
        $this->service->create(['name' => 'admin2']);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage("The name 'admin2' for guard 'api' already exists.");

        $this->service->create(['name' => 'admin2']);
    }

    /** @test */
    public function can_update_role()
    {
        $role = $this->service->create(['name' => 'editor', 'title' => 'Editor']);

        $updated = $this->service->update([
            'name' => 'editorUpdated',
            'title' => 'Editor Updated'
        ], $role->id);

        $this->assertTrue($updated);
        $this->assertDatabaseHas('roles', ['id' => $role->id, 'name' => 'editorUpdated']);
    }

    /** @test */
    public function can_delete_role()
    {
        $role = $this->service->create(['name' => 'toDelete', 'title' => 'To Delete']);

        $deleted = $this->service->delete($role->id);

        $this->assertTrue($deleted);
        $this->assertDatabaseMissing('roles', ['id' => $role->id]);
    }

    /** @test */
    public function assignForUser_assigns_roles_correctly()
    {
        $user = User::factory()->create();
        $role1 = $this->service->create(['name' => 'role1']);
        $role2 = $this->service->create(['name' => 'role2']);

        $assigned = $this->service->assignForUser($user, [$role1, $role2]);

        $this->assertContains('role1', $assigned);
        $this->assertContains('role2', $assigned);
        $this->assertCount(2, $user->roles);
    }

    /** @test */
    public function assignForUser_detaches_unreserved_roles_before_assigning()
    {
        $user = User::factory()->create();
        $reservedRole = Role::factory()->create([
            'name'=>'Role',
            'reserved' => true
        ]);
        $user->assignRole($reservedRole);

        $roleNew = $this->service->create(['name' => 'roleNew']);
        $assigned = $this->service->assignForUser($user, $roleNew);

        $this->assertContains('roleNew', $assigned);
        $this->assertDatabaseHas('roles', ['id' => $reservedRole->id]); // Reserved role still exists
    }
}
