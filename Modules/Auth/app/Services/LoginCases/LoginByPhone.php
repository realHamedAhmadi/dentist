<?php

namespace Modules\Auth\Services\LoginCases;

use Modules\Auth\Contracts\LoginPolicyInterface;
use Modules\Auth\Contracts\LoginStrategyInterface;
use Modules\Auth\Contracts\TokenProviderInterface;
use Modules\Auth\Enums\AuthMethod;
use Modules\Auth\Traits\AuthServiceTrait;
use Modules\Auth\Traits\LoginCaseTrait;
use Modules\Core\Enums\IdentifierType;
use Modules\Core\Helpers\Identifier;
use Modules\Auth\DTO\AuthenticatedResult;
use Modules\User\Models\User;
use Modules\Verification\Services\VerificationService;
use Modules\User\Services\ClientService;

class LoginByPhone implements LoginStrategyInterface
{
    use AuthServiceTrait,LoginCaseTrait;

    public function __construct(
        protected TokenProviderInterface $tokenProvider,
        protected VerificationService $verificationService,
        protected ClientService $clientService,
        protected LoginPolicyInterface $policy
    )
    {
    }

    public function type(): IdentifierType
    {
        return IdentifierType::PHONE;
    }

    public function supports(string $identifier): bool
    {
        return Identifier::isPhone($identifier);
    }

    public function handle(
        string  $identifier,
        ?string $credential,
        array   $options = []
    ): AuthenticatedResult
    {
        $user = User::where('phone', $identifier)->first();

        return $this->loginFlow(
            target: $user??$identifier,
            credential: $credential,
            method: AuthMethod::get($options['auth_method']??null),
            options: $options,
            requireVerification: true,
            registerData: $this->getRegisterData($identifier,$options)
        );
    }

    /**
     * @param string $phone
     * @param array $options
     * @return array
     */
    protected function getRegisterData(
        string $phone,
        array  $options
    ): array
    {
        return [
            'phone' => $phone,
            'first_name' => $options['first_name'] ?? '',
            'last_name' => $options['last_name'] ?? null,
            'password' => $options['password'] ?? null,
            'phone_verified_at' => now(),
            'last_login_at' => now(),
        ];
    }
}
