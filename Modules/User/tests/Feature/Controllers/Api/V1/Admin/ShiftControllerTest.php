<?php

namespace Modules\User\Tests\Feature\Controllers\Api\V1\Admin;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Modules\User\Models\Definition\Shift;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ShiftControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected string $rootRoute = 'api.v1.admin.';

    /** @test */
    public function index_returns_paginated_shifts()
    {
        Shift::factory()->count(5)->create();

        $response = $this->getJson(route($this->rootRoute . 'shifts.index'));

        $response->assertStatus(200);
        $response->assertJsonStructure(['data', 'links', 'meta']);
        $this->assertCount(5, $response->json('data'));
    }

    /** @test */
    public function store_creates_a_shift()
    {
        $payload = [
            'name' => 'Morning Shift',
            'start_time' => '08:00',
            'end_time' => '12:00',
        ];

        $response = $this->postJson(route($this->rootRoute . 'shifts.store'), $payload);

        $response->assertStatus(200);
        $response->assertJsonFragment(['name' => 'Morning Shift']);
        $this->assertDatabaseHas('shifts', $payload);
    }

    /** @test */
    public function store_fails_with_invalid_data()
    {
        $payload = [
            'name' => 'ab', // کمتر از 3
            'start_time' => '25:00', // invalid
            'end_time' => 'aa:bb', // invalid
        ];

        $response = $this->postJson(route($this->rootRoute . 'shifts.store'), $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'start_time', 'end_time']);
    }

    /** @test */
    public function show_returns_a_shift()
    {
        $shift = Shift::factory()->create();

        $response = $this->getJson(route($this->rootRoute . 'shifts.show', $shift->id));

        $response->assertStatus(200);
        $response->assertJsonFragment(['id' => $shift->id]);
    }

    /** @test */
    public function update_modifies_a_shift()
    {
        $shift = Shift::factory()->create([
            'name' => 'Old Shift',
            'start_time' => '08:00',
            'end_time' => '12:00',
        ]);

        $payload = [
            'name' => 'Updated Shift',
            'start_time' => '09:00',
            'end_time' => '13:00',
        ];

        $response = $this->putJson(route($this->rootRoute . 'shifts.update', $shift->id), $payload);

        $response->assertStatus(200);
        $response->assertJsonFragment(['name' => 'Updated Shift']);
        $this->assertDatabaseHas('shifts', array_merge(['id' => $shift->id], $payload));
    }

    /** @test */
    public function update_fails_with_invalid_data()
    {
        $shift = Shift::factory()->create();

        $payload = [
            'name' => 'ab',
            'start_time' => '25:00',
            'end_time' => 'aa:bb',
        ];

        $response = $this->putJson(route($this->rootRoute . 'shifts.update', $shift->id), $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'start_time', 'end_time']);
    }

    /** @test */
    public function destroy_deletes_a_shift()
    {
        $shift = Shift::factory()->create();

        $response = $this->deleteJson(route($this->rootRoute . 'shifts.destroy', $shift->id));

        $response->assertStatus(204);
        $this->assertDatabaseMissing('shifts', ['id' => $shift->id]);
    }
}

