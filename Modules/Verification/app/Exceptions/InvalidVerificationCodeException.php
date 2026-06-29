<?php

namespace Modules\Verification\Exceptions;

use Modules\Core\Exceptions\ClientSafeException;
use Modules\User\Contracts\Exceptions\VerificationExceptionInterface;

class InvalidVerificationCodeException extends ClientSafeException implements VerificationExceptionInterface
{
    protected string $errorCode='verification.invalid';
    protected int $status=422;
}
