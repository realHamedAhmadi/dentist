<?php

namespace Modules\User\Exceptions;

use Modules\Core\Exceptions\ClientSafeException;
use Symfony\Component\HttpFoundation\Response;

class AlreadyRegisteredForUserException extends ClientSafeException
{
    protected $message='Already registered for user.';

    public function __construct()
    {
        parent::__construct(
            errorCode: 'exceptions.already_registered_for_user',
            status: Response::HTTP_CONFLICT,
        );
    }
}
