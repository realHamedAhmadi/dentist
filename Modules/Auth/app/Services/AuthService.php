<?php

namespace Modules\Auth\Services;

use Modules\Auth\Contracts\TokenProviderInterface;
use Modules\Auth\Exceptions\NoLoginCaseFoundException;
use Modules\Auth\DTO\AuthenticatedResult;
use Modules\User\Models\User;
use Throwable;

class AuthService
{

    public function __construct(
        protected LoginCaseRegistry $registry,
        protected TokenProviderInterface $tokenProvider,
    )
    {
    }

    /**
     * @param string $identifier
     * @param string|null $credential
     * @param array $options
     * @return AuthenticatedResult
     * @throws Throwable
     */
    public function login(
        string  $identifier,
        ?string $credential,
        array   $options = []
    ): AuthenticatedResult
    {
        foreach ($this->registry->enabled() as $case) {
            if ($case->supports($identifier)) {
                return $case->handle($identifier, $credential, $options);
            }
        }
        throw new NoLoginCaseFoundException();
    }

    public function logout(?User $user=null, array $options = []): bool
    {
        return $this->tokenProvider->revokeFor($user, $options);
    }
}
