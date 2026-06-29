<?php

namespace Modules\User\Tests\Feature\Services;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\User\Models\Definition\Position;
use Modules\User\Services\PositionService;
use Tests\TestCase;

class PositionServiceTest extends TestCase
{
    use DatabaseTransactions;

    protected PositionService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new PositionService();
    }

    /** @test */
    public function it_finds_a_position_by_id()
    {
        $position = Position::factory()->create();

        $found = $this->service->find($position->id);

        $this->assertTrue($found->is($position));
    }

    /** @test */
    public function it_throws_exception_when_position_not_found()
    {
        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);

        $this->service->find(999);
    }

    /** @test */
    public function it_returns_all_positions_without_pagination()
    {
        Position::factory()->count(3)->create();

        $results = $this->service->get();

        $this->assertCount(3, $results);
    }

    /** @test */
    public function it_returns_paginated_positions()
    {
        Position::factory()->count(5)->create();

        $results = $this->service->get([], true, 2);

        $this->assertInstanceOf(\Illuminate\Pagination\LengthAwarePaginator::class, $results);
        $this->assertCount(2, $results->items());
    }

    /** @test */
    public function it_filters_positions_by_name_and_code()
    {
        Position::factory()->create(['name' => 'Doctor', 'code' => 'D01']);
        Position::factory()->create(['name' => 'Nurse', 'code' => 'N02']);

        $resultsByname = $this->service->get(['name' => 'Doc']);
        $resultsByCode = $this->service->get(['code' => 'N0']);

        $this->assertCount(1, $resultsByname);
        $this->assertEquals('Doctor', $resultsByname->first()->name);

        $this->assertCount(1, $resultsByCode);
        $this->assertEquals('Nurse', $resultsByCode->first()->name);
    }

    /** @test */
    public function it_creates_a_new_position()
    {
        $position = $this->service->create([
            'name' => 'Technician',
            'code' => 'T01',
        ]);

        $this->assertDatabaseHas('positions', [
            'name' => 'Technician',
            'code' => 'T01',
        ]);

        $this->assertInstanceOf(Position::class, $position);
    }

    /** @test */
    public function it_throws_exception_when_creating_duplicate_name_or_code()
    {
        Position::factory()->create(['name' => 'Admin', 'code' => 'A01']);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('The name or code is already exists!');

        $this->service->create([
            'name' => 'Admin',
            'code' => 'A01',
        ]);
    }

    /** @test */
    public function it_updates_a_position_successfully()
    {
        $position = Position::factory()->create(['name' => 'Nurse', 'code' => 'N01']);

        $result = $this->service->update([
            'name' => 'Senior Nurse',
            'code' => 'SN01',
        ], $position->id);

        $this->assertDatabaseHas('positions', [
            'id' => $position->id,
            'name' => 'Senior Nurse',
            'code' => 'SN01',
        ]);
    }

    /** @test */
    public function it_throws_exception_when_updating_to_duplicate_name_or_code()
    {
        $position1 = Position::factory()->create(['name' => 'Doctor', 'code' => 'D01']);
        $position2 = Position::factory()->create(['name' => 'Nurse', 'code' => 'N02']);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('The name or code is already exists!');

        $this->service->update([
            'name' => 'Doctor', // duplicate name
        ], $position2->id);
    }

    /** @test */
    public function it_deletes_a_position()
    {
        $position = Position::factory()->create();

        $result = $this->service->delete($position->id);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('positions', ['id' => $position->id]);
    }

    /** @test */
    public function it_throws_exception_when_deleting_nonexistent_position()
    {
        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);

        $this->service->delete(12345);
    }
}
