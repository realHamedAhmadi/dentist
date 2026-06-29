<?php

namespace Modules\Verification\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Request;
use Modules\Core\Helpers\CodeGenerator;
use Modules\User\Contracts\Config\VerificationConfigInterface;
use Modules\Verification\Enums\VerificationChannel;
use Modules\Verification\Exceptions\InvalidVerificationCodeException;
use Modules\Verification\Exceptions\VerificationAttemptsExceededException;
use Modules\Verification\Exceptions\VerificationExpiredException;

class VerificationCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'identifier',
        'code',
        'type',
        'expires_at',
        'resend_available_at',
        'attempts',
        'ip_address',
        'is_verified',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'resend_available_at' => 'datetime',
    ];

    /**
     * Check if the verification code is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isVerified()
    {
        return $this->is_verified;
    }

    /**
     * Check if the verification code is active and not expired.
     */
    public function isActive(): bool
    {
        return !$this->isExpired() && !$this->isVerified();
    }

    /**
     * Check if user can resend code.
     */
    public function canResend(): bool
    {
        return !$this->resend_available_at || $this->resend_available_at->isPast();
    }

    /**
     * Validate the code and increment attempts.
     */
    public function validateOrFail(string $code,VerificationConfigInterface $config): void
    {
        if ($this->isExpired()) {
            throw new VerificationExpiredException();
        }

        if (!$this->canAttempt($config)) {
            throw new VerificationAttemptsExceededException();
        }

        $this->increment('attempts');

        if (!hash_equals((string) $this->code, (string) $code)) {
            throw new InvalidVerificationCodeException();
        }
        $this->update([
            'is_verified'=>true,
        ]);
    }


    public function canAttempt(VerificationConfigInterface $config): bool
    {
        return $this->attempts < $config->maxAttempts();
    }

    public static function latestValidFor(
        string $identifier,
        VerificationChannel $channel
    ): ?self {
        return static::query()
            ->where('identifier', $identifier)
            ->where('type', $channel->value)
            ->where('ip_address',Request::ip())
            ->where('is_verified',false)
            ->latest()
            ->first();
    }

    public function expiresInSeconds(): int
    {
        if ($this->isExpired()) {
            return 0;
        }

        return max(
            0,
            now()->diffInSeconds($this->expires_at)
        );
    }

    public function resendAvailableInSeconds(): int
    {
        if ($this->canResend()) return 0;
        return $this->resend_available_at->diffInSeconds(now());
    }

    public static function issue(
        string $identifier,
        VerificationChannel $channel,
        VerificationConfigInterface $config,
    ): self {
        return static::create([
            'identifier' => $identifier,
            'type' => $channel->value,
            'code' => CodeGenerator::numeric($config->codeLength()),
            'attempts' => 0,
            'ip_address'=>Request::ip(),
            'expires_at' => now()->addMinutes(
                $config->ttlInMinutes()
            ),
            'resend_available_at'=>now()->addMinutes(
                $config->resendInMinutes()
            )
        ]);
    }


    /**
     * Delete expired codes.
     */
    public static function purgeExpired(): void
    {
        static::where('expires_at', '<', now())->delete();
    }
}
