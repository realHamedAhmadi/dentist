<?php

namespace Modules\User\Tests\Feature\Requests\Api\V1\Admin;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Modules\User\Models\Definition\Specialty;

class SpecialtyRequestTest extends TestCase
{
    use DatabaseTransactions;

    protected string $baseRoute = 'api.v1.admin.specialties.';

    public function test_exists_fields_in_lang()
    {
        $this->app->setLocale('fa');
        $attr='validation.attributes';
        $this->assertIsArray(trans($attr));
        $this->assertArrayHasKey('name',trans($attr));
    }

    /** @test */
    public function create_fails_when_name_is_missing()
    {
        $response = $this->postJson(route($this->baseRoute . 'store'), []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function create_fails_when_name_is_too_short()
    {
        $response = $this->postJson(route($this->baseRoute . 'store'), [
            'name' => 'ab'
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function create_passes_with_valid_name()
    {
        $response = $this->postJson(route($this->baseRoute . 'store'), [
            'name' => 'Good Specialty Name'
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function update_allows_missing_fields_because_of_sometimes_rule()
    {
        $record = Specialty::factory()->create(['name' => 'Old Name']);

        // در حالت update چون name → sometimes
        // ارسال نکردن فیلد نباید خطا بدهد
        $response = $this->putJson(route($this->baseRoute . 'update', $record->id), []);

        $response->assertStatus(200);
    }

    /** @test */
    public function update_fails_when_name_is_invalid()
    {
        $record = Specialty::factory()->create(['name' => 'Valid Name']);

        $response = $this->putJson(route($this->baseRoute . 'update', $record->id), [
            'name' => 'aa'
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function update_passes_with_valid_name()
    {
        $record = Specialty::factory()->create(['name' => 'Old Name']);

        $response = $this->putJson(route($this->baseRoute . 'update', $record->id), [
            'name' => 'New Name'
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function id_field_is_prohibited()
    {
        $response = $this->postJson(route($this->baseRoute . 'store'), [
            'id' => 999,
            'name' => 'Some Name'
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['id']);
    }
}
