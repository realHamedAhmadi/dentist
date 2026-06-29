<?php

namespace Modules\User\Tests\Feature\Controllers\Api\V1\Admin;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Modules\User\Models\Definition\Position;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PositionControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected string $rootRoute = 'api.v1.admin.';

    /** @test */
    public function it_fails_to_create_when_code_is_not_unique()
    {
        Position::factory()->create(['code' => 'A100']);

        $response = $this->postJson(
            route($this->rootRoute.'positions.store'),
            [
                'name' => 'Manager',
                'code'  => 'A100',
            ]
        );

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['code']);
    }

    /** @test */
    public function it_creates_a_position_successfully()
    {
        $response = $this->postJson(
            route($this->rootRoute.'positions.store'),
            [
                'name' => 'Developer',
                'code'  => 'C200',
            ]
        );

        $response->assertStatus(200);
        $this->assertDatabaseHas('positions', [
            'name' => 'Developer',
            'code'  => 'C200',
        ]);
    }

    /** @test */
    public function it_updates_position_when_code_is_same_as_existing()
    {
        $position = Position::factory()->create([
            'name' => 'Old name',
            'code'  => 'X500',
        ]);

        $response = $this->putJson(
            route($this->rootRoute.'positions.update', $position->id),
            [
                'name' => 'New name',
                'code'  => 'X500',
            ]
        );

        $response->assertStatus(200);
        $this->assertEquals('New name', $response->json('data.name'));
    }

    /** @test */
    public function it_fails_to_update_when_code_belongs_to_another_record()
    {
        $p1 = Position::factory()->create(['code' => 'ABC']);
        $p2 = Position::factory()->create(['code' => 'XYZ']);

        $response = $this->putJson(
            route($this->rootRoute.'positions.update', $p2->id),
            [
                'name' => 'Any name',
                'code'  => 'ABC', // کد متعلق به p1
            ]
        );

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['code']);
    }

    /** @test */
    public function it_shows_a_position()
    {
        $position = Position::factory()->create();

        $response = $this->getJson(
            route($this->rootRoute.'positions.show', $position->id)
        );

        $response->assertStatus(200);
        $this->assertEquals($position->id, $response->json('data.id'));
    }

    /** @test */
    public function it_lists_positions()
    {
        Position::factory()->count(3)->create();

        $response = $this->getJson(
            route($this->rootRoute.'positions.index')
        );

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    /** @test */
    public function it_deletes_a_position()
    {
        $position = Position::factory()->create();

        $response = $this->deleteJson(
            route($this->rootRoute.'positions.destroy', $position->id)
        );

        $response->assertStatus(204);
        $this->assertDatabaseMissing('positions', ['id' => $position->id]);
    }
}

