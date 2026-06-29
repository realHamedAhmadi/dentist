<?php

namespace Modules\Verification\Services;

use Modules\Core\Enums\IdentifierType;
use Modules\Core\Exceptions\NoIdentifierAvailableException;
use Modules\Core\Helpers\Identifier;
use Modules\Core\Services\User\FindUserService;
use Modules\User\Contracts\Config\VerificationConfigInterface;
use Modules\Verification\DTO\VerificationResult;
use Modules\Verification\Enums\VerificationChannel;
use Modules\Verification\Enums\VerificationPurpose;
use Modules\Verification\Events\VerificationRequestedEvent;
use Modules\Verification\Events\VerificationVerifiedEvent;
use Modules\Verification\Exceptions\InvalidVerificationCodeException;
use Modules\Verification\Exceptions\NoVerificationChannelAvailableException;
use Modules\Verification\Exceptions\VerificationAttemptsExceededException;
use Modules\Verification\Exceptions\VerificationExpiredException;
use Modules\User\Jobs\PurgeExpiredVerificationCodesJob;
use Modules\User\Models\User;
use Modules\Verification\Models\VerificationCode;

class VerificationService
{
    public function __construct(
        protected VerificationConfigInterface $config,
        protected FindUserService             $findUserService
    )
    {
    }

    public function verifyOrRequest(
        User|string $target,
        ?string     $code,
        VerificationPurpose $purpose
    ): VerificationResult
    {
        [$identifier, $channel] = $this->resolveTarget($target);

        if (!$code) {
            return $this->request($identifier,$purpose);
        }

        return $this->verify($identifier, $code,$purpose);
    }

    /**
     * Initial verification request (login / register)
     */
    public function request(
        string|user $target,
        VerificationPurpose $purpose
    ): VerificationResult
    {
        [$identifier, $channel] = $this->resolveTarget($target);

        $verification = VerificationCode::latestValidFor($identifier, $channel);

        if ($verification && $verification->isActive()) {
            return VerificationResult::blocked(
                receiver: $identifier,
                channel: $channel,
                expiresInSeconds: $verification->expiresInSeconds(),
                resendAvailableInSeconds: $verification->resendAvailableInSeconds()
            );
        }

        return $this->issueAndDispatch($identifier, $channel,$purpose);
    }

    /**
     * Explicit resend request (UI resend button)
     */
    public function resend(
        string|User $target,
        VerificationPurpose $purpose
    ): VerificationResult
    {
        [$identifier, $channel] = $this->resolveTarget($target);

        $verification = VerificationCode::latestValidFor($identifier, $channel);

        if ($verification && !$verification->canResend()) {
            return VerificationResult::blocked(
                receiver: $identifier,
                channel: $channel,
                expiresInSeconds: $verification->expiresInSeconds(),
                resendAvailableInSeconds: $verification->resendAvailableInSeconds()
            );
        }

        return $this->issueAndDispatch($identifier, $channel,$purpose);
    }

    /**
     * Verify submitted code
     *
     * @throws VerificationExpiredException
     * @throws VerificationAttemptsExceededException
     * @throws InvalidVerificationCodeException
     */
    public function verify(
        string|User $target,
        string      $code,
        VerificationPurpose $purpose
    ): VerificationResult
    {
        [$identifier, $channel] = $this->resolveTarget($target);

        $verification = VerificationCode::latestValidFor($identifier, $channel);

        if (!$verification) {
            throw new InvalidVerificationCodeException();
        }

        $verification->validateOrFail($code, $this->config);

        event(new VerificationVerifiedEvent($identifier, $channel,$purpose));

        return VerificationResult::verified($identifier, $channel);
    }

    /**
     * Housekeeping
     */
    public function purgeExpired(): void
    {
        PurgeExpiredVerificationCodesJob::dispatch();
    }

    /* -----------------------------------------------------------------
     |  Internals
     | -----------------------------------------------------------------
     */

    protected function issueAndDispatch(
        string              $identifier,
        VerificationChannel $channel,
        VerificationPurpose $purpose
    ): VerificationResult
    {
        $verification = VerificationCode::issue($identifier, $channel, $this->config);

        event(new VerificationRequestedEvent(
            identifier: $identifier,
            channel: $channel,
            code: $verification->code,
            purpose: $purpose
        ));

        return VerificationResult::sent(
            receiver: $identifier,
            channel: $channel,
            expiresInSeconds: $verification->expiresInSeconds(),
            resendAvailableInSeconds: $verification->resendAvailableInSeconds(),
            codeLength: strlen($verification->code),
            codeIsNumeric: is_numeric($verification->code)
        );
    }

    /**
     * @return array{0:string,1:VerificationChannel}
     */
    protected function resolveTarget(User|string $target): array
    {
        $preferredChannel = $this->config->channel();

        [$phone, $email] = $this->extractIdentifiers($target);

        $identifierType = $preferredChannel->identifierType();
        if ($identifierType === IdentifierType::PHONE && $phone) {
            return [$phone, $preferredChannel];
        }

        if ($identifierType === IdentifierType::EMAIL && $email) {
            return [$email, $preferredChannel];
        }

        return match (true) {
            $phone !== null => [$phone, IdentifierType::PHONE->verificationChannels()[0]],
            $email !== null => [$email, IdentifierType::EMAIL->verificationChannels()[0]],
            default => throw new NoVerificationChannelAvailableException()
        };
    }

    protected function extractIdentifiers(User|string $target): array
    {
        if ($target instanceof User) {
            return [$target->phone, $target->email];
        }

        $user = $this->findUserService->get($target);

        if ($user) {
            return [$user->phone, $user->email];
        }

        $phone = Identifier::isPhone($target) ? $target : null;
        $email = Identifier::isEmail($target) ? $target : null;

        if ((!$phone && !$email)) {
            throw new NoIdentifierAvailableException($target);
        }
        return [$phone, $email];
    }
}
