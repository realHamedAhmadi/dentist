<?php

namespace Modules\Auth\Services;

use Modules\Auth\Contracts\AuthMethodStrategyInterface;
use Modules\Auth\Contracts\LoginPolicyInterface;
use Modules\Auth\DTO\AuthDiscoveryResult;
use Modules\Auth\Exceptions\AuthenticationDeniedException;
use Modules\Auth\Services\AuthMethods\CodeAuthMethod;
use Modules\Auth\Services\AuthMethods\PasswordAuthMethod;
use Modules\Core\Services\User\FindUserService;
use Modules\Verification\Enums\VerificationPurpose;
use Modules\Verification\Services\VerificationService;

class AuthDiscoveryService
{
    /** @var class-string<AuthMethodStrategyInterface>[] */
    protected array $discoveryCases = [
        CodeAuthMethod::class,
        PasswordAuthMethod::class
    ];

    public function __construct(
        protected VerificationService $verificationService,
        protected FindUserService $findUserService,
        protected LoginPolicyInterface $policy,
    )
    {
    }

    public function discover(string $identifier): AuthDiscoveryResult
    {
        $user = $this->findUserService->get($identifier);
        $allowOtp = false;
        $methods=[];
        foreach ($this->discoveryCases as $case) {
            $obj = app($case);

            if (!$obj->isEnable() || !$obj->supports($user)) {
                continue;
            }
            $allowOtp= $allowOtp || $obj->requiresVerification($user);
            $methods[]=$obj->getMethod();
        }

        $otpResult=null;
        if ($allowOtp){
            $otpResult=$this->verificationService->request($user?:$identifier,VerificationPurpose::LOGIN);
        }

        if ($user){
            $this->policy->authorize($user);
        }
        return new AuthDiscoveryResult(
            exists: (bool)$user,
            identifier: $identifier,
            methods: $methods,
            isActive: $user?->is_active,
            allowRegistration: !$user,
            otp: $otpResult
        );
    }
}
