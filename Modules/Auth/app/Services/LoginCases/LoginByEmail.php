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

class LoginByEmail implements LoginStrategyInterface
{
    use AuthServiceTrait,LoginCaseTrait;

    public function __construct(
        protected TokenProviderInterface $tokenProvider,
        protected VerificationService    $verificationService,
        protected ClientService          $clientService,
        protected LoginPolicyInterface $policy
    )
    {
    }

    public function type(): IdentifierType
    {
        return IdentifierType::EMAIL;
    }

    public function supports(string $identifier): bool
    {
        return Identifier::isEmail($identifier);
    }

    public function handle(
        string  $identifier,
        ?string $credential,
        array   $options = []
    ): AuthenticatedResult
    {
        $user = User::where('email', $identifier)->first();

        return $this->loginFlow(
            target: $user ?? $identifier,
            credential: $credential,
            method: AuthMethod::PASSWORD,
            options: $options,
            requireVerification: true,
            registerData: $this->getRegisterData($identifier, $options)
        );
    }

    /**
     * @param string $email
     * @param array $options
     * @return array
     */
    protected function getRegisterData(
        string $email,
        array  $options
    ): array
    {
        $data = [
            'email' => $email,
            'username' => $options['username'] ?? strstr($email, '@', true),
        ];
        $data['first_name'] = $options['first_name'] ?? $data['username'];
        $data['password'] = $options['password'] ?? null;
        $data['last_login_at'] = now();
        $data['email_verified_at'] = now();
        return $data;
    }
}
