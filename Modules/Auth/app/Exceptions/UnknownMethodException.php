<?php

namespace Modules\Auth\Exceptions;

use RuntimeException;

class UnknownMethodException extends RuntimeException {

    public function errorCode(): string
    {
        return 'auth.unknown_method';
    }

    public function statusCode(): int
    {
        return 419;
    }
}
