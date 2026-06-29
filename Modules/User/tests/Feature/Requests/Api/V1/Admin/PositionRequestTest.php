<?php

namespace Modules\User\Tests\Feature\Requests\Api\V1\Admin;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Modules\User\Models\Definition\Position;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PositionRequestTest extends TestCase
{
    use DatabaseTransactions;

    protected string $rootRoute='api.v1.admin.';


    public function test_exists_fields_in_lang()
    {
        $this->app->setLocale('fa');
        $attr='validation.attributes';
        $this->assertIsArray(trans($attr));
        $this->assertArrayHasKey('name',trans($attr));
        $this->assertArrayHasKey('code',trans($attr));
        $this->assertArrayHasKey('description',trans($attr));
    }

    /** @test */
    public function create_fails_when_code_is_not_unique()
    {
        Position::factory()->create(['code' => 'A100']);

        $response = $this->postJson(route($this->rootRoute.'positions.store'), [
            'name' => 'Manager',
            'code'  => 'A100',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['code']);
    }

    /** @test */
    public function create_passes_with_valid_data()
    {
        $response = $this->postJson(route($this->rootRoute.'positions.store'), [
            'name' => 'Developer',
            'code'  => 'C200',
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function update_passes_when_code_is_same_as_current()
    {
        $position = Position::factory()->create([
            'name' => 'Old name',
            'code'  => 'X500',
        ]);

        $response = $this->putJson(route($this->rootRoute.'positions.update',$position->id), [
            'code'  => 'X500', // مقدار خودش
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function update_fails_when_code_belongs_to_another_position()
    {
        $p1 = Position::factory()->create(['code' => 'ABC']);
        $p2 = Position::factory()->create(['code' => 'XYZ']);

        $response = $this->putJson(route($this->rootRoute.'positions.update',$p2->id), [
            'name' => null,
            'code'  => 'ABC', // تکراری متعلق به رکورد دیگر
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['code']);
    }

    /** @test */
    public function update_allows_nullable_name()
    {
        $position = Position::factory()->create();

        $response = $this->putJson(route($this->rootRoute.'positions.update',$position->id), [
            'code'  => $position->code,
        ]);

        $response->assertStatus(200);
    }
}

