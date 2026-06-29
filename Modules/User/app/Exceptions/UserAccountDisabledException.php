<?php

namespace Modules\User\Exceptions;

use Modules\Core\Exceptions\ClientSafeException;

class UserAccountDisabledException extends ClientSafeException {
    public function __construct()
    {
        $this->message='This account is disabled.';
        parent::__construct(
            $this->errorCode = 'exceptions.account_disabled',
            $this->status = 403
        );
    }
}
