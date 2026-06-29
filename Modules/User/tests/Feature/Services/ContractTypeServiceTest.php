<?php
namespace Modules\User\Tests\Feature\Services;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\User\Services\ContractTypeService;
use Modules\User\Models\Definition\ContractType;

class ContractTypeServiceTest extends TestCase
{
    use DatabaseTransactions;

    protected ContractTypeService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new ContractTypeService();
    }

    /** @test */
    public function it_finds_a_contract_type()
    {
        $contractType = ContractType::factory()->create();

        $found = $this->service->find($contractType->id);

        $this->assertEquals($contractType->id, $found->id);
    }

    /** @test */
    public function it_gets_all_contract_types()
    {
        ContractType::factory()->count(3)->create();

        $records = $this->service->get();

        $this->assertCount(3, $records);
    }

    /** @test */
    public function it_gets_paginated_contract_types()
    {
        ContractType::factory()->count(5)->create();

        $records = $this->service->get([], true, 10);

        $this->assertEquals(5, $records->total());
        $this->assertEquals(10, $records->perPage());
    }

    /** @test */
    public function it_filters_contract_types_by_name()
    {
        ContractType::factory()->create(['name' => 'Full-Time']);
        ContractType::factory()->create(['name' => 'Part-Time']);

        $records = $this->service->get(['name' => 'Full']);

        $this->assertCount(1, $records);
        $this->assertEquals('Full-Time', $records->first()->name);
    }

    /** @test */
    public function it_creates_a_contract_type()
    {
        $data = ['name' => 'Temporary'];

        $record = $this->service->create($data);

        $this->assertDatabaseHas('contract_types', $data);
        $this->assertEquals('Temporary', $record->name);
    }

    /** @test */
    public function it_throws_exception_when_creating_duplicate_name()
    {
        ContractType::factory()->create(['name' => 'Full-Time']);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('The name is already exists!');

        $this->service->create(['name' => 'Full-Time']);
    }

    /** @test */
    public function it_updates_a_contract_type()
    {
        $contractType = ContractType::factory()->create(['name' => 'Short-Term']);

        $updated = $this->service->update(['name' => 'Long-Term'], $contractType->id);

        $this->assertEquals('Long-Term', $updated->name);
        $this->assertDatabaseHas('contract_types', [
            'id' => $contractType->id,
            'name' => 'Long-Term'
        ]);
    }

    /** @test */
    public function it_throws_exception_when_updating_to_duplicate_name()
    {
        ContractType::factory()->create(['name' => 'Contract A']);
        $ct = ContractType::factory()->create(['name' => 'Contract B']);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('The name is already exists!');

        $this->service->update(['name' => 'Contract A'], $ct->id);
    }

    /** @test */
    public function it_deletes_a_contract_type()
    {
        $contractType = ContractType::factory()->create();

        $deleted = $this->service->delete($contractType->id);

        $this->assertTrue($deleted);
        $this->assertDatabaseMissing('contract_types', ['id' => $contractType->id]);
    }
}
