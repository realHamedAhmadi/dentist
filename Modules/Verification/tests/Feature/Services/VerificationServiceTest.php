<?php
namespace Modules\Verification\Tests\Feature\Services;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Modules\Verification\Enums\VerificationChannel;
use Modules\User\Models\User;
use Modules\Verification\Models\VerificationCode;
use Modules\Verification\Services\VerificationService;
use Tests\TestCase;

class VerificationServiceTest extends TestCase
{
    use DatabaseTransactions;

    protected VerificationService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new VerificationService();
    }

    /** @test */
    public function it_creates_verification_code_and_logs_sms()
    {
        Log::shouldReceive('info')->once();

        $identifier='09216549866';
        $verification = $this->service->sendCode($identifier, VerificationChannel::SMS);

        $this->assertDatabaseHas('verification_codes', [
            'identifier' => $identifier,
            'type' => 'sms',
        ]);

        $this->assertNotNull($verification->code);
    }

    /** @test */
    public function it_creates_verification_code_and_logs_email()
    {
        Log::shouldReceive('info')->once();

        $identifier='test@example.com';

        $verification = $this->service->sendCode($identifier, VerificationChannel::EMAIL);

        $this->assertDatabaseHas('verification_codes', [
            'identifier' => $identifier,
            'type' => 'email',
        ]);
    }

    /** @test */
    public function it_verifies_correct_code()
    {
        $verification = VerificationCode::factory()->create([
            'identifier' => '09216549866',
            'code' => '123456',
            'type' => 'sms',
            'expires_at' => now()->addMinutes(5)
        ]);

        $result = $this->service->verifyCode('09216549866', '123456', VerificationChannel::SMS);

        $this->assertTrue($result);
    }

    /** @test */
    public function it_fails_with_wrong_code()
    {
        VerificationCode::factory()->create([
            'identifier' => '09123456789',
            'code' => '111111',
            'type' => 'sms',
            'expires_at' => now()->addMinutes(5)
        ]);

        $result = $this->service->verifyCode('09123456789', '999999', VerificationChannel::SMS);

        $this->assertFalse($result);
    }

    /** @test */
    public function it_fails_when_code_is_expired()
    {
        VerificationCode::factory()->create([
            'identifier' => '09123456789',
            'code' => '123456',
            'type' => 'sms',
            'expires_at' => now()->subMinute() // expired
        ]);

        $result = $this->service->verifyCode('09123456789', '123456', VerificationChannel::SMS);

        $this->assertFalse($result);
    }

    /** @test */
    public function it_purges_expired_codes()
    {
        $expired = VerificationCode::factory()->create([
            'identifier' => '09123456789',
            'code'=>'12345',
            'type'=>'email',
            'expires_at' => now()->subMinutes(10),
        ]);

        $valid = VerificationCode::factory()->create([
            'identifier' => '09012345678',
            'code'=>'12345',
            'type'=>'email',
            'expires_at' => now()->addMinutes(10),
        ]);

        $this->service->purgeExpired();

        $this->assertDatabaseMissing('verification_codes', [
            'id' => $expired->id,
        ]);

        $this->assertDatabaseHas('verification_codes', [
            'id' => $valid->id,
        ]);
    }
}

