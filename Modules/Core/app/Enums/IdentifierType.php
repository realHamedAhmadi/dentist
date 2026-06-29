<?php

namespace Modules\Core\Enums;

use Modules\Verification\Enums\VerificationChannel;
use Modules\Verification\Exceptions\NoVerificationChannelAvailableException;

enum IdentifierType:string
{
    case PHONE='phone';

    case EMAIL='email';

    case USERNAME='username';

    case NATIONAL_CODE='national_code';

    case GOOGLE='google#';

    public function verificationChannels():array
    {
        return match ($this){
            self::PHONE=>[VerificationChannel::SMS,VerificationChannel::WHATSAPP],
            self::EMAIL=>[VerificationChannel::EMAIL],
            self::USERNAME, self::NATIONAL_CODE =>[VerificationChannel::SMS,VerificationChannel::EMAIL,VerificationChannel::WHATSAPP],
            default=> throw new NoVerificationChannelAvailableException(),
        };
    }
}

