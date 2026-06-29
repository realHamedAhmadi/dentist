<?php

namespace Modules\Auth\Tests\Feature\Services\Auth\Providers;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Modules\Auth\Services\Providers\SanctumTokenProvider;
use Modules\User\Models\User;
use Tests\TestCase;

class SanctumTokenProviderTest extends TestCase
{
    use DatabaseTransactions;

    protected SanctumTokenProvider $provider;

    protected function setUp(): void
    {
        parent::setUp();
        $this->provider = new SanctumTokenProvider();
    }

    /** @test */
    public function it_issues_a_token_with_default_name()
    {
        $user = User::factory()->create();

        $result = $this->provider->issueFor($user);

        $this->assertIsArray($result);
        $this->assertEquals('token', $result['type']);
        $this->assertIsString($result['token']);

        // Token must exist in the DB
        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'name' => 'api-token'
        ]);
    }

    /** @test */
    public function it_issues_a_token_with_custom_name()
    {
        $user = User::factory()->create();

        $result = $this->provider->issueFor($user, [
            'token_name' => 'mobile'
        ]);

        $this->assertEquals('token', $result['type']);

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'name' => 'mobile'
        ]);
    }

    /** @test */
    public function it_revokes_current_token()
    {
        $user = User::factory()->create();

        // Issue token manually
        $token = $user->createToken('device');

        // Sanctum needs authenticated user to identify current token
        $user->withAccessToken($token->accessToken);

        $result = $this->provider->revokeFor($user);

        $this->assertTrue($result);

        // Token should be deleted
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'name' => 'device'
        ]);
    }

    /** @test */
    public function revoke_returns_true_even_if_no_token_exists()
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $result = $this->provider->revokeFor($user);

        $this->assertTrue($result);
    }
}

