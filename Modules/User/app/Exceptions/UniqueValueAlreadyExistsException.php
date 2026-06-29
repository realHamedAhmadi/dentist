<?php

namespace Modules\User\Exceptions;

use Modules\Core\Exceptions\ClientSafeException;
use Symfony\Component\HttpFoundation\Response;

class UniqueValueAlreadyExistsException extends ClientSafeException
{
    public function __construct(?string $attribute = null)
    {
        parent::__construct(
            errorCode: 'exceptions.unique_value_already_exists',
            status: Response::HTTP_CONFLICT,
            attributes: $attribute ? ['attribute' => $attribute] : []
        );
    }
}
