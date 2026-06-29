<?php
namespace Modules\User\Tests\Feature\Services;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\User\Models\Definition\Specialty;
use Modules\User\Services\SpecialtyService;
use Tests\TestCase;

class SpecialtyServiceTest extends TestCase
{
    use DatabaseTransactions;

    protected SpecialtyService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new SpecialtyService;
    }

    /** @test */
    public function it_finds_specialty_by_id()
    {
        $record = Specialty::factory()->create();

        $found = $this->service->find($record->id);

        $this->assertEquals($record->id, $found->id);
    }

    /** @test */
    public function it_gets_all_specialties_without_pagination()
    {
        Specialty::factory()->count(3)->create();

        $result = $this->service->get();

        $this->assertCount(3, $result);
    }

    /** @test */
    public function it_gets_specialties_with_name_filter()
    {
        Specialty::factory()->create(['name' => 'Cardio']);
        Specialty::factory()->create(['name' => 'Neuro']);

        $result = $this->service->get(['name' => 'Car']);

        $this->assertCount(1, $result);
        $this->assertEquals('Cardio', $result->first()->name);
    }

    /** @test */
    public function it_paginates_specialties()
    {
        Specialty::factory()->count(5)->create();

        $result = $this->service->get([], paginate: true, perPage: 2);

        $this->assertEquals(2, $result->perPage());
        $this->assertEquals(5, $result->total());
    }

    /** @test */
    public function it_creates_specialty()
    {
        $record = $this->service->create(['name' => 'Dermatology']);

        $this->assertDatabaseHas('specialties', [
            'id' => $record->id,
            'name' => 'Dermatology'
        ]);
    }

    /** @test */
    public function it_throws_exception_if_create_duplicate_name()
    {
        Specialty::factory()->create(['name' => 'Eye']);

        $this->expectException(\RuntimeException::class);

        $this->service->create(['name' => 'Eye']);
    }

    /** @test */
    public function it_updates_specialty()
    {
        $record = Specialty::factory()->create(['name' => 'Old']);

        $this->service->update(['name' => 'New'], $record->id);

        $this->assertDatabaseHas('specialties', [
            'id' => $record->id,
            'name' => 'New'
        ]);
    }

    /** @test */
    public function it_throws_exception_if_update_duplicate_name()
    {
        Specialty::factory()->create(['name' => 'A']);
        $record = Specialty::factory()->create(['name' => 'B']);

        $this->expectException(\RuntimeException::class);

        $this->service->update(['name' => 'A'], $record->id);
    }

    /** @test */
    public function it_deletes_specialty()
    {
        $record = Specialty::factory()->create();

        $this->service->delete($record->id);

        $this->assertDatabaseMissing('specialties', [
            'id' => $record->id
        ]);
    }
}
