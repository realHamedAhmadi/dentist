<?php
namespace Modules\Auth\Tests\Services;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\Auth\Contracts\LoginPolicyInterface;
use Modules\Auth\Exceptions\AuthenticationDeniedException;
use Modules\Auth\Services\AuthDiscoveryService;
use Modules\User\Models\Admin;
use Modules\Verification\DTO\VerificationResult;
use Modules\Verification\Enums\VerificationChannel;
use Modules\User\Models\User;
use Modules\Verification\Services\VerificationService;
use Modules\Core\Services\User\FindUserService;
use Tests\TestCase;
use Mockery;

class AuthDiscoveryServiceTest extends TestCase
{
    use DatabaseTransactions;

    protected AuthDiscoveryService $discoveryService;
    protected VerificationService $verificationService;
    protected FindUserService $findUserService;
    protected LoginPolicyInterface $policy;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock VerificationService
        $this->verificationService = Mockery::mock(VerificationService::class);
        $this->verificationService
            ->shouldReceive('request')
            ->andReturn(VerificationResult::sent('22323',
                VerificationChannel::EMAIL,
                60
            ));

        $this->policy=Mockery::mock(LoginPolicyInterface::class);
        $this->policy->shouldReceive('authorize');

        $this->findUserService = app(FindUserService::class);

        $this->discoveryService = new AuthDiscoveryService(
            verificationService: $this->verificationService,
            findUserService: $this->findUserService,
            policy: $this->policy
        );
    }

    public function testDiscoverUserWithPassword(): void
    {
        $user = User::factory()->create([
            'email'=>'fdfdfdf@fdfd.com',
            'password' => 'secret',
        ]);

        $user=Mockery::mock($user)->makePartial();
        $user->shouldReceive('canLogin')->andReturn(true);

        $result = $this->discoveryService->discover($user->email);

        $this->assertTrue($result->exists);
        $this->assertContains('password', $result->methods);
        $this->assertContains('code', $result->methods);
        $this->assertNull($result->otp); // چون user پسورد دارد
    }

    public function testDiscoverUserWithoutPassword(): void
    {
        $user = User::factory()->create([
            'email'=>'fdfdfdf@fdfd.com',
            'password' => null,
        ]);

        $result = $this->discoveryService->discover($user->email);

        $this->assertTrue($result->exists);
        $this->assertNotContains('password', $result->methods);
        $this->assertContains('code', $result->methods);
        $this->assertInstanceOf(VerificationResult::class, $result->otp); // چون user پسورد ندارد، کد ارسال شده
    }

    public function testDiscoverNonExistentUser(): void
    {
        $identifier = 'notfound@example.com';

        $result = $this->discoveryService->discover($identifier);

        $this->assertFalse($result->exists);
        $this->assertNotContains('password', $result->methods);
        $this->assertContains('code', $result->methods);
        $this->assertInstanceOf(VerificationResult::class, $result->otp);
        $this->assertTrue($result->allowRegistration);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}
