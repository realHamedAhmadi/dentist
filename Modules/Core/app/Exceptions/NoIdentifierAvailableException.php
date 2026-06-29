<?php

namespace Modules\Core\Exceptions;

class NoIdentifierAvailableException extends ClientSafeException {

    public function __construct(protected string $identifier )
    {
        $this->message=sprintf('No identifier available for: %s', $this->identifier);
        $this->errorCode='auth.no_identifier_available';
        $this->status=402;
    }
}
