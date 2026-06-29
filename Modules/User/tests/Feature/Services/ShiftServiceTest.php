<?php

namespace Modules\User\Tests\Feature\Services;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\User\Services\ShiftService;
use Modules\User\Models\Definition\Shift;

class ShiftServiceTest extends TestCase
{
    use DatabaseTransactions;

    protected ShiftService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new ShiftService();
    }

    /** @test */
    public function it_finds_a_shift_by_id()
    {
        $shift = Shift::factory()->create();

        $found = $this->service->find($shift->id);

        $this->assertEquals($shift->id, $found->id);
    }

    /** @test */
    public function find_throws_exception_if_not_found()
    {
        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);

        $this->service->find(999);
    }

    /** @test */
    public function it_gets_all_shifts_without_filters()
    {
        Shift::factory()->count(3)->create();

        $results = $this->service->get();

        $this->assertCount(3, $results);
    }

    /** @test */
    public function it_gets_filtered_shifts()
    {
        Shift::factory()->create(['name' => 'Morning']);
        Shift::factory()->create(['name' => 'Evening']);

        $results = $this->service->get(['name' => 'Morning']);

        $this->assertCount(1, $results);
        $this->assertEquals('Morning', $results->first()->name);
    }

    /** @test */
    public function it_paginates_results_if_requested()
    {
        Shift::factory()->count(5)->create();

        $paginated = $this->service->get([], true, 2);

        $this->assertEquals(2, $paginated->perPage());
        $this->assertEquals(5, $paginated->total());
        $this->assertInstanceOf(\Illuminate\Pagination\LengthAwarePaginator::class, $paginated);
    }

    /** @test */
    public function it_creates_a_shift_successfully()
    {
        $data = [
            'name' => 'Night Shift',
            'start_time' => '22:00',
            'end_time' => '06:00',
        ];

        $shift = $this->service->create($data);

        $this->assertDatabaseHas('shifts', ['id' => $shift->id, 'name' => 'Night Shift']);
    }

    /** @test */
    public function create_throws_exception_if_name_exists()
    {
        Shift::factory()->create(['name' => 'Duplicate Shift']);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('The name is already exists!');

        $this->service->create([
            'name' => 'Duplicate Shift',
            'start_time' => '08:00',
            'end_time' => '12:00',
        ]);
    }

    /** @test */
    public function it_updates_a_shift_successfully()
    {
        $shift = Shift::factory()->create([
            'name' => 'Old Shift',
            'start_time' => '08:00',
            'end_time' => '12:00',
        ]);

        $updated = $this->service->update([
            'name' => 'Updated Shift',
            'start_time' => '09:00',
            'end_time' => '13:00',
        ], $shift->id);

        $this->assertEquals('Updated Shift', $updated->name);
        $this->assertDatabaseHas('shifts', ['id' => $shift->id, 'name' => 'Updated Shift']);
    }

    /** @test */
    public function update_throws_exception_if_name_exists_for_another_shift()
    {
        $s1 = Shift::factory()->create(['name' => 'Existing Shift']);
        $s2 = Shift::factory()->create(['name' => 'Old Name']);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('The name is already exists!');

        $this->service->update(['name' => 'Existing Shift'], $s2->id);
    }

    /** @test */
    public function it_deletes_a_shift_successfully()
    {
        $shift = Shift::factory()->create();

        $result = $this->service->delete($shift->id);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('shifts', ['id' => $shift->id]);
    }

    /** @test */
    public function delete_throws_exception_if_shift_not_found()
    {
        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);

        $this->service->delete(999);
    }
}
