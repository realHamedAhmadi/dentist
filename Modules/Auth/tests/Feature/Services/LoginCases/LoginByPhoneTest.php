<?php

namespace Modules\Auth\Tests\Services\LoginCases;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Modules\Auth\DTO\AuthenticatedResult;
use Modules\Auth\Enums\AuthMethod;
use Modules\Auth\Services\Providers\SanctumTokenProvider;
use Modules\Auth\Services\LoginCases\LoginByPhone;
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
 * @group login-by-phone
 *
 * - Unit Test (mock loginFlow)
 * - Integration Test
 */
class LoginByPhoneTest extends TestCase
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
        $loginByPhone = new LoginByPhone(
            $this->tokenProvider,
            $this->verificationService,
            $this->clientService
        );

        $this->assertTrue($loginByPhone->supports('09216549866'));
        $this->assertFalse($loginByPhone->supports('test@example.com'));
    }

    /* -----------------------------------------------------------------
     |  Integration Test (Real Flow)
     |------------------------------------------------------------------*/

    /** @test */
    public function user_can_login_by_phone_with_real_login_flow(): void
    {
        $phone = '09216549866';
        $password = 'secret';

        $user = User::factory()->create([
            'phone' => $phone,
            'password' => $password,
        ]);

        $this->app->bind(TokenProviderInterface::class, fn() => new SanctumTokenProvider()
        );

        $loginByPhone = new LoginByPhone(
            app(TokenProviderInterface::class),
            app(VerificationService::class),
            app(ClientService::class),
        );

        $result = $loginByPhone->handle($phone, $password);

        $this->assertSame($user->id, $result->user->id);
        $this->assertArrayHasKey('token', $result->token);
    }

    /** @test */
    public function user_can_register_by_phone_with_real_login_flow(): void
    {
        $phone = '09216549866';

        $verification=VerificationCode::issue($phone,
            VerificationChannel::SMS,
            app(VerificationConfigInterface::class)
        );

        $loginByPhone = new LoginByPhone(
            app(TokenProviderInterface::class),
            app(VerificationService::class),
            app(ClientService::class),
        );

        $result = $loginByPhone->handle($phone, $verification->code);

        $this->assertDatabaseHas(User::table(), [
            'phone'=>$phone,
        ]);
        $this->assertArrayHasKey('token', $result->token);
    }

    /** @test */
    public function user_cant_login_with_invalid_code(): void
    {
        $phone = '09216549866';

        $verification=VerificationCode::issue($phone,
            VerificationChannel::SMS,
            app(VerificationConfigInterface::class)
        );

        $loginByPhone = new LoginByPhone(
            app(TokenProviderInterface::class),
            app(VerificationService::class),
            app(ClientService::class),
        );
        $this->expectException(InvalidVerificationCodeException::class);
        $result = $loginByPhone->handle($phone, '323231');
    }

    /** @test */
    public function user_cant_login_with_expired_code(): void
    {
        $phone = '09216549866';

        $verification=VerificationCode::issue($phone,
            VerificationChannel::SMS,
            app(VerificationConfigInterface::class)
        );

        Log::info($verification->expiresInSeconds());
        $verification->update([
            'expires_at'=>now()->subMinutes(120)
        ]);

        Log::info($verification->fresh()->expiresInSeconds());

        $loginByPhone = new LoginByPhone(
            app(TokenProviderInterface::class),
            app(VerificationService::class),
            app(ClientService::class),
        );
        $this->expectException(VerificationExpiredException::class);
        $result = $loginByPhone->handle($phone,$verification->code);
    }
}
