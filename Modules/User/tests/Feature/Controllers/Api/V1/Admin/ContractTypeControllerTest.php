<?php

namespace Modules\User\Tests\Feature\Controllers\Api\V1\Admin;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\User\Models\Definition\ContractType;

class ContractTypeControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected string $route = 'api.v1.admin.contract-types.';

    /** @test */
    public function it_lists_contract_types()
    {
        ContractType::factory()->count(3)->create();

        $response = $this->getJson(route($this->route . 'index'));

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
    }

    /** @test */
    public function it_stores_a_contract_type()
    {
        $payload = [
            'name' => 'Full-Time',
        ];

        $response = $this->postJson(route($this->route . 'store'), $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('contract_types', $payload);
    }

    /** @test */
    public function store_fails_validation()
    {
        $response = $this->postJson(route($this->route . 'store'), [
            'name' => 'ab', // کم‌تر از 3 کاراکتر
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function it_shows_a_contract_type()
    {
        $record = ContractType::factory()->create();

        $response = $this->getJson(route($this->route . 'show', $record->id));

        $response->assertStatus(200);
        $response->assertJsonFragment(['id' => $record->id]);
    }

    /** @test */
    public function show_returns_404_for_invalid_id()
    {
        $response = $this->getJson(route($this->route . 'show', 999));

        $response->assertStatus(404);
    }

    /** @test */
    public function it_updates_a_contract_type()
    {
        $record = ContractType::factory()->create(['name' => 'Old']);

        $response = $this->putJson(route($this->route.'update', $record->id), [
            'name' => 'Updated Name'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('contract_types', [
            'id' => $record->id,
            'name' => 'Updated Name'
        ]);
    }

    /** @test */
    public function update_fails_validation()
    {
        $record = ContractType::factory()->create();

        $response = $this->putJson(route($this->route.'update', $record->id), [
            'name' => 'aa', // نامعتبر
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function it_deletes_a_contract_type()
    {
        $record = ContractType::factory()->create();

        $response = $this->deleteJson(route($this->route.'destroy', $record->id));

        $response->assertStatus(204);
        $this->assertDatabaseMissing('contract_types', ['id' => $record->id]);
    }

    /** @test */
    public function delete_returns_404_for_invalid_id()
    {
        $response = $this->deleteJson(route($this->route.'destroy', 444));

        $response->assertStatus(404);
    }
}
