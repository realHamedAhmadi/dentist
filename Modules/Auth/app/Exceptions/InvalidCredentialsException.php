<?php

namespace Modules\Auth\Exceptions;

use Modules\Core\Exceptions\ClientSafeException;

class InvalidCredentialsException extends ClientSafeException {

    protected string $errorCode='auth.invalid_credential';
    protected int $status=422;

    public function __construct(string $identifier = null)
    {
        $by='';
        if ($identifier){
            $by=' by:';
        }
        $this->message=sprintf('Invalid credentials%s %s',$by,$identifier);
    }
}
