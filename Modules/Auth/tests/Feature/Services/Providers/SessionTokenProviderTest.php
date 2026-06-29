<?php

namespace Modules\Auth\Tests\Feature\Services\Auth\Providers;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Modules\Auth\Services\Auth\Providers\SessionTokenProvider;
use Modules\User\Models\User;
use Tests\TestCase;

class SessionTokenProviderTest extends TestCase
{
    use RefreshDatabase;

    protected SessionTokenProvider $provider;

    protected function setUp(): void
    {
        parent::setUp();
        $this->provider = new SessionTokenProvider();
        config(['auth.defaults.guard' => 'web']);
    }

    /** @test */
    public function it_logs_in_user_and_returns_session_type()
    {
        $user = User::factory()->create();

        $result = $this->provider->issueFor($user);

        $this->assertEquals('session', $result['type']);
        $this->assertTrue(Auth::check());
        $this->assertEquals($user->id, Auth::id());
    }

    /** @test */
    public function it_logs_in_user_with_remember_me()
    {
        $user = User::factory()->create();

        $result = $this->provider->issueFor($user, ['remember' => true]);

        $this->assertEquals('session', $result['type']);
        $this->assertTrue(Auth::check());
        $this->assertEquals($user->id, Auth::id());

        // Cookie for remember token must exist
        $this->assertNotNull(Auth::user()->getRememberToken());
    }

    /** @test */
    public function it_logs_out_user()
    {
        $user = User::factory()->create();

        // Login first
        $this->provider->issueFor($user);

        $this->assertTrue(Auth::check());

        // Revoke
        $result = $this->provider->revokeFor($user);

        $this->assertTrue($result);
        $this->assertFalse(Auth::check());
    }

    /** @test */
    public function revoke_returns_true_even_if_no_user_is_logged_in()
    {
        $this->assertFalse(Auth::check());

        $result = $this->provider->revokeFor(new User());

        $this->assertTrue($result);
        $this->assertFalse(Auth::check());
    }
}
