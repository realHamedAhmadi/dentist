<?php

namespace Modules\Verification\Exceptions;


use Modules\Core\Exceptions\ClientSafeException;
use Modules\User\Contracts\Exceptions\VerificationExceptionInterface;

class VerificationExpiredException extends ClientSafeException implements VerificationExceptionInterface
{
    protected string $errorCode='verification.expired';
    protected int $status=422;
}
