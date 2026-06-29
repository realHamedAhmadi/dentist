<?php

namespace Modules\User\Exceptions;

use RuntimeException;

class NoIdentifierTypeAvailableException extends RuntimeException {
    protected $message='No identifier type available';
}
