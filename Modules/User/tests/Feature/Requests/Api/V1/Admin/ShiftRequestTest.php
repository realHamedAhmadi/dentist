<?php

namespace Modules\User\Tests\Feature\Requests\Api\V1\Admin;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Modules\User\Models\Definition\Shift;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ShiftRequestTest extends TestCase
{
    use DatabaseTransactions;

    protected string $rootRoute = 'api.v1.admin.'; // مطابق پروژه خودت


    public function test_exists_fields_in_lang()
    {
        $this->app->setLocale('fa');
        $attr='validation.attributes';
        $this->assertIsArray(trans($attr));
        $this->assertArrayHasKey('name',trans($attr));
        $this->assertArrayHasKey('start_time',trans($attr));
        $this->assertArrayHasKey('end_time',trans($attr));
    }

    /** @test */
    public function store_fails_when_required_fields_are_missing()
    {
        $response = $this->postJson(route($this->rootRoute . 'shifts.store'), []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'start_time', 'end_time']);
    }

    /** @test */
    public function store_passes_with_valid_data()
    {
        $payload = [
            'name' => 'Morning Shift',
            'start_time' => '08:00',
            'end_time' => '12:00',
        ];

        $response = $this->postJson(route($this->rootRoute . 'shifts.store'), $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('shifts', $payload);
    }

    /** @test */
    public function store_fails_if_id_is_present()
    {
        $payload = [
            'id' => 99,
            'name' => 'Shift',
            'start_time' => '08:00',
            'end_time' => '12:00',
        ];

        $response = $this->postJson(route($this->rootRoute . 'shifts.store'), $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['id']);
    }

    /** @test */
    public function store_fails_if_name_too_short_or_too_long()
    {
        $payload = [
            'name' => 'ab', // کمتر از 3
            'start_time' => '08:00',
            'end_time' => '12:00',
        ];

        $response = $this->postJson(route($this->rootRoute . 'shifts.store'), $payload);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);

        $payload['name'] = str_repeat('a', 65); // بیشتر از 64
        $response = $this->postJson(route($this->rootRoute . 'shifts.store'), $payload);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function store_fails_if_start_or_end_time_invalid()
    {
        $payload = [
            'name' => 'Shift',
            'start_time' => '25:00',
            'end_time' => 'aa:bb',
        ];

        $response = $this->postJson(route($this->rootRoute . 'shifts.store'), $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['start_time', 'end_time']);
    }

    /** @test */
    public function update_allows_missing_fields()
    {
        $shift = Shift::factory()->create();

        $response = $this->putJson(route($this->rootRoute . 'shifts.update', $shift->id), []);

        $response->assertStatus(200); // یا 204 بسته به کنترلر
    }

    /** @test */
    public function update_passes_with_valid_data()
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

        $response = $this->putJson(route($this->rootRoute.'shifts.update', $shift->id), $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('shifts', array_merge(['id' => $shift->id], $payload));
    }
}


