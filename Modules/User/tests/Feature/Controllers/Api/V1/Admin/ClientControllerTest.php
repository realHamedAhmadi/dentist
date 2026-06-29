<?php

namespace Modules\User\Tests\Feature\Controllers\Api\V1\Admin;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use Modules\User\Models\Client;
use Modules\User\Models\User;

class ClientControllerTest extends TestCase
{
    use DatabaseTransactions, WithFaker;

    protected User $admin;

    protected $rootRoute='api.v1.admin.';

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create();
        Sanctum::actingAs($this->admin, ['*']);
    }

    /** @test */
    public function it_can_list_clients()
    {
        Client::factory()->count(5)->create();

        $response = $this->getJson(route($this->rootRoute.'clients.index'));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'full_name', 'phone', 'is_active']
                ]
            ]);
    }

    /** @test */
    public function it_can_show_a_client()
    {
        $client = Client::factory()->create();

        $response = $this->getJson(route($this->rootRoute.'clients.show', $client));

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $client->id,
                'full_name' => $client->full_name,
            ]);
    }

    /** @test */
    public function it_can_create_a_client()
    {
        $data = Client::factory()->make()->toArray();
        $response = $this->postJson(route($this->rootRoute.'clients.store'), $data);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'first_name' => $data['first_name'],
                'phone' => $data['phone'],
            ]);

        $this->assertDatabaseHas('clients', [
            'first_name' => $data['first_name'],
            'phone' => $data['phone'],
        ]);
    }

    /** @test */
    public function it_can_update_a_client()
    {
        $client = Client::factory()->create();
        $newData = Client::factory()->make()->toArray();

        $response = $this->putJson(route($this->rootRoute.'clients.update', $client), $newData);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $client->id,
                'first_name' => $newData['first_name'],
            ]);

        $this->assertDatabaseHas('clients', [
            'id' => $client->id,
            'first_name' => $newData['first_name'],
        ]);
    }

    /** @test */
    public function it_can_delete_a_client()
    {
        $client = Client::factory()->create();

        $response = $this->deleteJson(route($this->rootRoute.'clients.destroy', $client));

        $response->assertStatus(204);

        $this->assertDatabaseMissing('clients', [
            'id' => $client->id,
        ]);
    }
}
