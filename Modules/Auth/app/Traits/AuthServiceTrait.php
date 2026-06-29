<?php

namespace Modules\Auth\Traits;

use Illuminate\Support\Facades\Hash;
use JetBrains\PhpStorm\ArrayShape;
use Modules\Auth\Contracts\LoginPolicyInterface;
use Modules\Auth\DTO\AuthenticatedResult;
use Modules\Auth\Enums\AuthMethod;
use Modules\Auth\Exceptions\InvalidCredentialsException;
use Modules\Auth\Exceptions\UnknownMethodException;
use Modules\User\Models\User;
use Modules\Verification\Enums\VerificationPurpose;
use RuntimeException;
use Throwable;

trait AuthServiceTrait
{

    protected LoginPolicyInterface $policy;
    /*
   | -----------------------------------------------------------------
   |  FLOWS
   | -----------------------------------------------------------------
   */

    /**
     * @internal used by LoginStrategy implementations only
     */
    protected function loginFlow(
        User|string $target,
        ?string     $credential,
        AuthMethod  $method,
        array       $options,
        bool        $requireVerification,
        array       $registerData = []
    ): AuthenticatedResult
    {
        if ($target instanceof User) {
            $this->policy->authorize($target);

            return $this->authenticate($target, $credential, $method, $options);
        }

        if ($requireVerification) {
            $this->verify($target, $credential);
        }
        $user = $this->register(array_merge($options, $registerData));

        return $this->authSuccess($user, $options);
    }

    /* -----------------------------------------------------------------
     |  AUTHENTICATION
     | -----------------------------------------------------------------
     */

    /**
     * @throws Throwable
     */
    protected function authenticate(
        User       $user,
        ?string    $credential,
        AuthMethod $method,
        array      $options
    ): AuthenticatedResult
    {
        return match ($method) {
            AuthMethod::PASSWORD => $this->authenticateByPassword($user, $credential, $options),
            AuthMethod::CODE => $this->authenticateByCode($user, $credential, $options),
            AuthMethod::TRUSTED => $this->authSuccess($user, $options),
            default => throw new UnknownMethodException(),
        };
    }

    protected function authenticateByPassword(
        User    $user,
        ?string $password,
        array   $options
    ): AuthenticatedResult
    {
        if (!$password || !Hash::check($password, $user->password ?? '')) {
            throw new InvalidCredentialsException();
        }

        return $this->authSuccess($user, $options);
    }

    /**
     * @throws Throwable
     */
    protected function authenticateByCode(
        User    $user,
        ?string $code,
        array   $options
    ): AuthenticatedResult
    {
        $this->verify($user, $code);

        return $this->authSuccess($user, $options);
    }

    /* -----------------------------------------------------------------
     |  REGISTRATION
     | -----------------------------------------------------------------
     */

    protected function register(
        array $data
    ): User
    {
        $record = $this->clientService->create($data);

        return $record->user;
    }

    /* -----------------------------------------------------------------
     |  VERIFICATION
     | -----------------------------------------------------------------
     */
    /**
     * @throws Throwable
     */

    protected function verify(
        User|string $target,
        ?string     $code,
    ): void
    {
        $this->verificationService->verify($target, $code,VerificationPurpose::LOGIN);
    }

    /* -----------------------------------------------------------------
     |  SUCCESS & SESSION
     | -----------------------------------------------------------------
     */

    #[ArrayShape([
        'user' => User::class,
        'roles' => 'array',
        'token' => 'array',
        'choose_role' => 'bool'
    ])]
    protected function authSuccess(User $user, array $options): AuthenticatedResult
    {
        $roles = $user->roles->pluck('name')->values()->toArray();
        $chooseRole = count($roles) > 1;

        if (!$chooseRole && $roles) {
            $this->setActiveRoleInMemory($user, $roles[0]);
        }
        return new AuthenticatedResult(
            user: $user,
            roles: $roles,
            token: $this->tokenProvider->issueFor($user, $options)->toArray(),
            chooseRole: $chooseRole
        );
    }

    protected function setActiveRoleInMemory(User $user, string $role): User
    {
        if (!$user->hasRole($role)) {
            throw new RuntimeException('User does not have this role.');
        }

        $user->setAttribute('active_role', $role);
        return $user;
    }
}
