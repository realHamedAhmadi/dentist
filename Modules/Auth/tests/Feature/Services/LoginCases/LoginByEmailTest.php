<?php

namespace Modules\Auth\Tests\Services\LoginCases;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Modules\Auth\DTO\AuthenticatedResult;
use Modules\Auth\Enums\AuthMethod;
use Modules\Auth\Services\LoginCases\LoginByEmail;
use Modules\Auth\Services\Providers\SanctumTokenProvider;
use Modules\Auth\Contracts\TokenProviderInterface;
use Modules\User\Contracts\Config\VerificationConfigInterface;
use Modules\Verification\Enums\VerificationChannel;
use Modules\Verification\Exceptions\InvalidVerificationCodeException;
use Modules\Verification\Exceptions\VerificationExpiredException;
use Modules\User\Models\User;
use Modules\Verification\Models\VerificationCode;
use Modules\Verification\Services\VerificationService;
use Modules\User\Services\ClientService;
use Mockery;
use Tests\TestCase;

/**
 * @group login-by-email
 *
 * - Unit Test (mock loginFlow)
 * - Integration Test
 */
class LoginByEmailTest extends TestCase
{
    use DatabaseTransactions;

    protected TokenProviderInterface $tokenProvider;
    protected VerificationService $verificationService;
    protected ClientService $clientService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tokenProvider = Mockery::mock(TokenProviderInterface::class);
        $this->verificationService = Mockery::mock(VerificationService::class);
        $this->clientService = Mockery::mock(ClientService::class);
    }

    /* -----------------------------------------------------------------
     |  Unit Tests
     |------------------------------------------------------------------*/

    /** @test */
    public function it_supports_phone_identifier(): void
    {
        $login = new LoginByEmail(
            $this->tokenProvider,
            $this->verificationService,
            $this->clientService
        );

        $this->assertTrue($login->supports('test@example.com'));
        $this->assertFalse($login->supports('09216549866'));
    }

    /* -----------------------------------------------------------------
     |  Integration Test (Real Flow)
     |------------------------------------------------------------------*/

    /** @test */
    public function user_can_login_by_email_with_real_login_flow(): void
    {
        $identifier = 'test@example.com';
        $password = 'secret';

        $user = User::factory()->create([
            'email' => $identifier,
            'password' => $password,
        ]);

        $this->app->bind(TokenProviderInterface::class, fn() => new SanctumTokenProvider()
        );

        $login = new LoginByEmail(
            app(TokenProviderInterface::class),
            app(VerificationService::class),
            app(ClientService::class),
        );

        $result = $login->handle($identifier, $password);

        $this->assertSame($user->id, $result->user->id);
        $this->assertArrayHasKey('token', $result->token);
    }

    /** @test */
    public function user_can_register_by_email_with_real_login_flow(): void
    {
        $identifier = 'test@example.com';

        $verification=VerificationCode::issue($identifier,
            VerificationChannel::EMAIL,
            app(VerificationConfigInterface::class)
        );

        $login = new LoginByEmail(
            app(TokenProviderInterface::class),
            app(VerificationService::class),
            app(ClientService::class),
        );

        $result = $login->handle($identifier, $verification->code,['phone'=>'344343']);

        $this->assertDatabaseHas(User::table(), [
            'email'=>$identifier,
        ]);
        $this->assertArrayHasKey('token', $result->token);
    }

    /** @test */
    public function user_cant_login_with_invalid_code(): void
    {
        $identifier = 'test@example.com';

        $verification=VerificationCode::issue($identifier,
            VerificationChannel::EMAIL,
            app(VerificationConfigInterface::class)
        );
        $login = new LoginByEmail(
            app(TokenProviderInterface::class),
            app(VerificationService::class),
            app(ClientService::class),
        );
        $this->expectException(InvalidVerificationCodeException::class);
        $result = $login->handle($identifier, '323231');
    }

    /** @test */
    public function user_cant_login_with_expired_code(): void
    {
        $identifier = 'test@example.com';

        $verification=VerificationCode::issue($identifier,
            VerificationChannel::EMAIL,
            app(VerificationConfigInterface::class)
        );

        Log::info($verification->expiresInSeconds());
        $verification->update([
            'expires_at'=>now()->subMinutes(120)
        ]);

        Log::info($verification->fresh()->expiresInSeconds());

        $login = new LoginByEmail(
            app(TokenProviderInterface::class),
            app(VerificationService::class),
            app(ClientService::class),
        );
        $this->expectException(VerificationExpiredException::class);
        $result = $login->handle($identifier,$verification->code);
    }
}
