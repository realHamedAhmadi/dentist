<?php

namespace Modules\Auth\Tests\Services\AuthMethods;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\Auth\Services\AuthMethods\CodeAuthMethod;
use Modules\User\Models\User;
use Tests\TestCase;

class CodeAuthMethodTest extends TestCase
{
    use DatabaseTransactions;

    protected CodeAuthMethod $authMethod;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authMethod = new CodeAuthMethod();
    }

    public function testRequiresVerification(): void
    {
        // یوزر بدون پسورد
        $userWithoutPassword = User::factory()->create([
            'password' => null,
        ]);
        $this->assertTrue($this->authMethod->requiresVerification($userWithoutPassword));

        // یوزر با پسورد
        $userWithPassword = User::factory()->create([
            'password' => 'secret',
        ]);
        $this->assertFalse($this->authMethod->requiresVerification($userWithPassword));
    }

    public function testSupportsAlwaysTrue(): void
    {
        $user = User::factory()->create();
        $this->assertTrue($this->authMethod->supports($user));
    }

    public function testGetMethod(): void
    {
        $this->assertEquals('code', $this->authMethod->getMethod());
    }
}
