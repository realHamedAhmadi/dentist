<?php

namespace Modules\Verification\DTO;

use JetBrains\PhpStorm\ArrayShape;
use Modules\Core\Contracts\DTO\BaseDtoInterface;
use Modules\Verification\Enums\VerificationChannel;
use Modules\Verification\Enums\VerificationStatus;

final class VerificationResult implements BaseDtoInterface
{
    private function __construct(
        public readonly VerificationStatus  $status,
        public readonly string              $receiver,
        public readonly VerificationChannel $channel,
        public readonly ?int                $expiresInSeconds = null,
        public readonly ?int                $resendAvailableInSeconds = null,
        public readonly int                 $codeLength = 6,
        public readonly bool                $codeIsNumeric = true

    )
    {
    }

    public static function sent(
        string              $receiver,
        VerificationChannel $channel,
        int                 $expiresInSeconds,
        int                 $resendAvailableInSeconds = 0,
        ?int                $codeLength = 6,
        bool                $codeIsNumeric = true
    ): self
    {
        return new self(
            status: VerificationStatus::SENT,
            receiver: $receiver,
            channel: $channel,
            expiresInSeconds: $expiresInSeconds,
            resendAvailableInSeconds: $resendAvailableInSeconds,
            codeLength: $codeLength,
            codeIsNumeric: $codeIsNumeric
        );
    }

    public static function blocked(
        string              $receiver,
        VerificationChannel $channel,
        int                 $expiresInSeconds,
        int                 $resendAvailableInSeconds
    ): self
    {
        return new self(
            status: VerificationStatus::BLOCKED,
            receiver: $receiver,
            channel: $channel,
            expiresInSeconds: $expiresInSeconds,
            resendAvailableInSeconds: $resendAvailableInSeconds
        );
    }

    public static function verified(
        string              $receiver,
        VerificationChannel $channel
    ): self
    {
        return new self(
            status: VerificationStatus::VERIFIED,
            receiver: $receiver,
            channel: $channel
        );
    }

    public function isSent(): bool
    {
        return $this->status === VerificationStatus::SENT;
    }

    public function isBlocked(): bool
    {
        return $this->status === VerificationStatus::BLOCKED;
    }

    public function isVerified(): bool
    {
        return $this->status === VerificationStatus::VERIFIED;
    }

    public function isRequested(): bool
    {
        return $this->isSent() || $this->isBlocked();
    }

    public function requiresUserAction(): bool
    {
        return $this->status !== VerificationStatus::VERIFIED;
    }


    #[ArrayShape([
        'status' => 'string',
        'receiver' => 'string',
        'channel' => 'string',
        'expires_in_seconds' => 'int',
        'resend_available_in_seconds' => 'int',
        'code_length' => 'int',
        'code_is_numeric' => 'bool',
    ])]
    public function toArray(): array
    {
        return [
            'status' => $this->status->value,
            'receiver' => $this->receiver,
            'channel' => $this->channel->value,
            'expires_in_seconds' => $this->expiresInSeconds,
            'resend_available_in_seconds' => $this->resendAvailableInSeconds,
            'code_length' => $this->codeLength,
            'code_is_numeric' => $this->codeIsNumeric,
        ];
    }

    public function meta():array
    {
        return $this->toArray();
    }

    public function data(): array
    {
        return [];
    }
}
