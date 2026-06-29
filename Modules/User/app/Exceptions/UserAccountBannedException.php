<?php

namespace Modules\User\Exceptions;

use Modules\Core\Exceptions\ClientSafeException;

class UserAccountBannedException extends ClientSafeException {

    public function __construct()
    {
        $this->message='This account has been banned.';
        parent::__construct(
            $this->errorCode = 'exceptions.account_banned',
            $this->status = 403
        );
    }
}
