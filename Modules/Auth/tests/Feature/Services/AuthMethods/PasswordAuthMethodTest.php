<?php

namespace Modules\Auth\Tests\Services\AuthMethods;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\Auth\Services\AuthMethods\PasswordAuthMethod;
use Modules\User\Models\User;
use Tests\TestCase;

class PasswordAuthMethodTest extends TestCase
{
    use DatabaseTransactions;

    protected PasswordAuthMethod $authMethod;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authMethod = new PasswordAuthMethod();
    }

    public function testSupports(): void
    {
        $userWithoutPassword = User::factory()->create([
            'password' => null,
        ]);
        $this->assertFalse($this->authMethod->supports($userWithoutPassword));

        $userWithPassword = User::factory()->create([
            'password' => bcrypt('secret'),
        ]);
        $this->assertTrue($this->authMethod->supports($userWithPassword));
    }

    public function testRequiresVerification(): void
    {
        $userWithoutPassword = User::factory()->create([
            'password' => null,
        ]);
        $this->assertTrue($this->authMethod->requiresVerification($userWithoutPassword));

        $userWithPassword = User::factory()->create([
            'password' => bcrypt('secret'),
        ]);
        $this->assertFalse($this->authMethod->requiresVerification($userWithPassword));
    }

    public function testGetMethod(): void
    {
        $this->assertEquals('password', $this->authMethod->getMethod());
    }
}
