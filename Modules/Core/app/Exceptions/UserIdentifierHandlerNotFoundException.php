<?php

namespace Modules\Core\Exceptions;

use Modules\Core\Enums\IdentifierType;
use RuntimeException;

class UserIdentifierHandlerNotFoundException extends RuntimeException {

    public function __construct(string|IdentifierType $identifierType)
    {
        if ($identifierType instanceof IdentifierType){
            $identifierType=$identifierType->value;
        }
        parent::__construct(
            sprintf('No handler found for identifier type: %s', $identifierType)
        );
    }
}
