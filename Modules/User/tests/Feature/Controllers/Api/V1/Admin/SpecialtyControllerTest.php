<?php

namespace Modules\User\Tests\Feature\Controllers\Api\V1\Admin;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Modules\User\Models\Definition\Specialty;

class SpecialtyControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected string $baseRoute = 'api.v1.admin.specialties.';

    /** @test */
    public function index_returns_paginated_list()
    {
        Specialty::factory()->count(3)->create();

        $response = $this->getJson(route($this->baseRoute . 'index'));

        $response->assertStatus(200);
        $response->assertJsonStructure(['data', 'links', 'meta']);
    }

    /** @test */
    public function store_creates_specialty()
    {
        $response = $this->postJson(route($this->baseRoute . 'store'), [
            'name' => 'Cardiology'
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('data.name', 'Cardiology');

        $this->assertDatabaseHas('specialties', ['name' => 'Cardiology']);
    }

    /** @test */
    public function store_fails_validation()
    {
        $response = $this->postJson(route($this->baseRoute . 'store'), []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function show_returns_single_specialty()
    {
        $record = Specialty::factory()->create();

        $response = $this->getJson(route($this->baseRoute . 'show', $record->id));

        $response->assertStatus(200);
        $response->assertJsonPath('data.id', $record->id);
    }

    /** @test */
    public function update_modifies_specialty()
    {
        $record = Specialty::factory()->create(['name' => 'Old Name']);

        $response = $this->putJson(route($this->baseRoute . 'update', $record->id), [
            'name' => 'New Name'
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('data.name', 'New Name');

        $this->assertDatabaseHas('specialties', [
            'id' => $record->id,
            'name' => 'New Name'
        ]);
    }

    /** @test */
    public function update_fails_validation()
    {
        $record = Specialty::factory()->create(['name' => 'Old Name']);

        $response = $this->putJson(route($this->baseRoute . 'update', $record->id), [
            'name' => 'aa' // کمتر از 3 کاراکتر
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function it_deletes_a_specialty()
    {
        $record = Specialty::factory()->create();

        $response = $this->deleteJson(route($this->baseRoute . 'destroy', $record->id));

        $response->assertNoContent();

        $this->assertDatabaseMissing('specialties', ['id' => $record->id]);
    }
}
