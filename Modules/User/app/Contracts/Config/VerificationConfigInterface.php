<?php

namespace Modules\User\Contracts\Config;

use Modules\Verification\Enums\VerificationChannel;

interface VerificationConfigInterface
{
    public function channel():VerificationChannel;

    public function maxAttempts():int;

    public function codeLength():int;

    public function ttlInMinutes():int;

    public function resendInMinutes():int;

    public function codeIsNumeric():bool;
}
