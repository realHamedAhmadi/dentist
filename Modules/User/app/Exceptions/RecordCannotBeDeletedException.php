<?php
namespace Modules\Core\Exceptions;

use Modules\Core\Exceptions\ClientSafeException;
use Symfony\Component\HttpFoundation\Response;

class RecordCannotBeDeletedException extends ClientSafeException
{
    public function __construct(array $attributes = [])
    {
        parent::__construct(
            errorCode: 'exceptions.record_cannot_be_deleted',
            status: Response::HTTP_CONFLICT,
            attributes: $attributes
        );
    }
}
