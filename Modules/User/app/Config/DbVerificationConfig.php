<?php
namespace Modules\User\Config;

use Modules\Core\Models\DevSetting;
use Modules\Setting\Models\GeneralSetting;
use Modules\User\Contracts\Config\VerificationConfigInterface;
use Modules\Verification\Enums\VerificationChannel;

class DbVerificationConfig implements VerificationConfigInterface
{

    public function channel(): VerificationChannel
    {
        return DevSetting::verificationChannel();
    }

    public function maxAttempts(): int
    {
        return DevSetting::verificationMaxAttempts();
    }

    public function codeLength(): int
    {
        return DevSetting::verificationCodeLength();
    }

    public function ttlInMinutes(): int
    {
        return DevSetting::verificationTtl();
    }
    public function resendInMinutes(): int
    {
        return DevSetting::verificationResendCooldown();
    }

    public function codeIsNumeric(): bool
    {
        return DevSetting::verificationCodeIsNumeric();
    }
}
