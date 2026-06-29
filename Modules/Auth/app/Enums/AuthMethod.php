<?php

namespace Modules\Auth\Enums;

enum AuthMethod:string {
    case PASSWORD='password';
    case CODE='code';
    case TRUSTED='trusted';

    public static function get(?string $value):self
    {
        return self::tryFrom($value)?:self::PASSWORD;
    }
}
