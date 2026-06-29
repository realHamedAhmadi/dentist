<?php

namespace Modules\Core\Helpers;

class CodeGenerator
{
    /**
     * Generate a random numeric code.
     *
     * @param int $length
     * @return string
     */
    public static function numeric(int $length = 6): string
    {
        return str_pad((string)rand(0, (10 ** $length) - 1), $length, '0', STR_PAD_LEFT);
    }

    /**
     * Generate a random alphanumeric code.
     *
     * @param int $length
     * @return string
     */
    public static function alphanumeric(int $length = 8): string
    {
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return substr(str_shuffle(str_repeat($chars, ceil($length / strlen($chars)))), 0, $length);
    }
}

