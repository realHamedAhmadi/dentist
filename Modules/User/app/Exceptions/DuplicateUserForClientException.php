<?php

namespace Modules\User\Exceptions;

use Modules\Core\Exceptions\ClientSafeException;

class DuplicateUserForClientException extends ClientSafeException {

    protected $message='A user is already registered for this client.';
    protected string $errorCode='exceptions.duplicate_user_for_client';
    protected int $status=409;

}
