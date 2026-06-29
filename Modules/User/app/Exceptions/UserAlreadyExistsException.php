<?php
namespace Modules\User\Exceptions;

use Modules\Core\Exceptions\ClientSafeException;
use Symfony\Component\HttpFoundation\Response;

class UserAlreadyExistsException extends ClientSafeException
{
    public function __construct(array $attributes = [])
    {
        parent::__construct(
            errorCode: 'exceptions.user_already_exists',
            status: Response::HTTP_CONFLICT,
            attributes: $attributes
        );
    }
}
