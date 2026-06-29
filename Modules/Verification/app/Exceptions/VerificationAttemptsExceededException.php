<?php

namespace Modules\Verification\Exceptions;

use Exception;
use Modules\Core\Exceptions\ClientSafeException;
use Modules\User\Contracts\Exceptions\VerificationExceptionInterface;

class VerificationAttemptsExceededException extends ClientSafeException implements VerificationExceptionInterface
{
    protected string $errorCode='verification.attempts_exceeded';
    protected int $status=429;

}
