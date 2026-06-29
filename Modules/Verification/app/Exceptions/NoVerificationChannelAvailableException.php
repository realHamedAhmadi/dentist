<?php

namespace Modules\Verification\Exceptions;

use Modules\Core\Exceptions\ClientSafeException;
use Modules\User\Contracts\Exceptions\VerificationExceptionInterface;
use Throwable;

class NoVerificationChannelAvailableException extends ClientSafeException implements VerificationExceptionInterface
{
    public function __construct(string $message = "")
    {
        $this->errorCode='verification.no_channel_available';
        $this->status=423;
        $this->message=$message?:trans($this->getErrorCode(),[],'en');
    }
}
