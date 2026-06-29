<?php

namespace Modules\Auth\Exceptions;


use Modules\Core\Exceptions\ClientSafeException;

class AuthenticationDeniedException extends ClientSafeException
{

    public function __construct()
    {
        $this->message='The user is not allowed to log in to this account at the moment.';
        parent::__construct(
            $this->errorCode = 'auth.authentication_denied',
            $this->status = 403
        );
    }
}
