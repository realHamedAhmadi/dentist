<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\User\Enums\VerificationChannel;

class DeveloperSetting extends Model
{
    use HasFactory;

    protected $fillable = ['country', 'local', 'dir', 'timezone', 'currency',
        'min_phone_length', 'max_phone_length', 'country_phone_code',
        'national_code_is_numeric', 'min_national_code_length', 'max_national_code_length',
        'calendar', 'verification_channel', 'verification_max_attempts','verification_ttl',
        'verification_code_length', 'verification_resend_in_minutes','verification_code_is_numeric',
    ];
    protected static $cached;
    const ID = 1;

    public static function clearCache()
    {
        static::$cached = null;
    }

    protected static function booted()
    {
        static::$cached = static::find(static::ID);
    }

    public static function local()
    {
        if (!static::$cached)
            static::booted();
        return static::$cached->local;
    }

    public static function dir()
    {
        if (!static::$cached)
            static::booted();
        return static::$cached->dir;
    }

    public static function minPhoneLength()
    {
        if (!static::$cached)
            static::booted();
        return static::$cached->min_phone_length;
    }

    public static function maxPhoneLength()
    {
        if (!static::$cached)
            static::booted();
        return static::$cached->max_phone_length;
    }

    public static function countryPhoneCode()
    {
        if (!static::$cached)
            static::booted();
        return static::$cached->country_phone_code;
    }

    public static function nationalCodeIsNumeric()
    {
        if (!static::$cached)
            static::booted();
        return static::$cached->national_code_is_numeric;
    }

    public static function minNationalCodeLength()
    {
        if (!static::$cached)
            static::booted();
        return static::$cached->min_national_code_length;
    }

    public static function maxNationalCodeLength()
    {
        if (!static::$cached)
            static::booted();
        return static::$cached->max_national_code_length;
    }

    public static function calendar()
    {
        if (!static::$cached)
            static::booted();
        return static::$cached->calendar;
    }

    public static function verificationChannel(): VerificationChannel
    {
        if (!static::$cached)
            static::booted();

        return VerificationChannel::tryFrom(
                static::$cached->verification_channel
            ) ?? VerificationChannel::SMS;
    }

    public static function verificationMaxAttempts(): int
    {
        if (!static::$cached)
            static::booted();
        return static::$cached->verification_max_attempts ?? 5;
    }

    public static function verificationCodeLength(): int
    {
        if (!static::$cached)
            static::booted();
        return static::$cached->verification_code_length ?? 6;
    }

    public static function verificationTtl(): int
    {
        if (!static::$cached)
            static::booted();
        return static::$cached->verification_ttl??5;
    }

    public static function verificationResendCooldown(): int
    {
        if (!static::$cached)
            static::booted();
        return static::$cached->verification_resend_in_minutes??2;
    }

    public static function verificationCodeIsNumeric(): int
    {
        if (!static::$cached)
            static::booted();
        return static::$cached->verification_code_is_numeric??true;
    }

}
