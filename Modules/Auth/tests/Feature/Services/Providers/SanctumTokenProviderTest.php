<?php

namespace Modules\Auth\Tests\Feature\Services\Providers;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Laravel\Sanctum\Sanctum;
use Modules\Auth\DTO\TokenProviderResult;
use Modules\Auth\Services\Providers\SanctumTokenProvider;
use Modules\User\Models\User;
use Tests\TestCase;

class SanctumTokenProviderTest extends TestCase
{
    use DatabaseTransactions;

    private SanctumTokenProvider $provider;

    protected function setUp(): void
    {
        parent::setUp();
        $this->provider = new SanctumTokenProvider();
    }

    public function test_it_issues_a_token_with_default_name(): void
    {
        $user = User::factory()->create();

        $result = $this->provider->issueFor($user);

        // Result must be a TokenProviderResult DTO, not a plain array
        $this->assertInstanceOf(TokenProviderResult::class, $result);

        $data = $result->toArray();

        // DTO key is 'driver', value is 'sanctum'
        $this->assertEquals('sanctum', $data['driver']);
        $this->assertIsString($data['token']);

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'name'         => 'api-token',
        ]);
    }

    public function test_it_issues_a_token_with_custom_name(): void
    {
        $user = User::factory()->create();

        $result = $this->provider->issueFor($user, ['token_name' => 'mobile']);

        $this->assertInstanceOf(TokenProviderResult::class, $result);
        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'name'         => 'mobile',
        ]);
    }

    public function test_it_revokes_current_token(): void
    {
        $user  = User::factory()->create();
        $token = $user->createToken('device');

        // Authenticate via Sanctum so currentAccessToken() is populated
        Sanctum::actingAs($user);

        // Assign the actual access token model to the user instance
        $user->withAccessToken($token->accessToken);

        $result = $this->provider->revokeFor($user);

        $this->assertTrue($result);

        // The token row must be deleted from personal_access_tokens
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'name'         => 'device',
        ]);
    }

    public function test_revoke_returns_true_even_if_no_token_exists(): void
    {
        // User without an active token — revokeFor must not throw and must return true
        $user = User::factory()->create();

        $result = $this->provider->revokeFor($user);

        $this->assertTrue($result);
    }
}
