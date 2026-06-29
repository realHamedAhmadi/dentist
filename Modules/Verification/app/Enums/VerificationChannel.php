<?php

namespace Modules\Verification\Enums;

use Modules\Core\Enums\IdentifierType;
use Modules\User\Exceptions\NoIdentifierTypeAvailableException;

enum VerificationChannel:string {

    case SMS = 'sms';
    case EMAIL = 'email';
    case WHATSAPP='whatsapp';


    public function identifierType():IdentifierType
    {
        return match ($this){
            self::SMS, self::WHATSAPP =>IdentifierType::PHONE,
            self::EMAIL=>IdentifierType::EMAIL,
            default=> throw new NoIdentifierTypeAvailableException()
        };
    }
}
