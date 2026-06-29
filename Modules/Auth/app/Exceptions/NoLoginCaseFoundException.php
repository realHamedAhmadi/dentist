<?php

namespace Modules\Auth\Exceptions;

use Exception;

class NoLoginCaseFoundException extends Exception {

    protected $message='No login case found for this identifier.';
}
