<?php

namespace Modules\Core\Helpers;

use libphonenumber\PhoneNumberUtil;
use Modules\Core\Enums\IdentifierType;
use Modules\User\Exceptions\NoIdentifierTypeAvailableException;

final class Identifier
{
    public static function detect(string $identifier):IdentifierType
    {
        return match (true){
            Identifier::isPhone($identifier)=>IdentifierType::PHONE,
            Identifier::isEmail($identifier)=>IdentifierType::EMAIL,
            Identifier::isNationalCode($identifier)=>IdentifierType::NATIONAL_CODE,
            Identifier::isUsername($identifier)=>IdentifierType::USERNAME,
            default=> throw new NoIdentifierTypeAvailableException()
        };
    }

    public static function isEmail(string $value):bool
    {
        return filter_var($value, FILTER_VALIDATE_EMAIL);
    }

    public static function isPhone(string $value): bool
    {
        return PhoneNumberUtil::isViablePhoneNumber($value);
    }

    public static function isUsername(string $value): bool
    {
        return !self::isPhone($value) && !self::isEmail($value);
    }

    public static function isNationalCode(string $value):bool
    {
        return false;
    }
}

