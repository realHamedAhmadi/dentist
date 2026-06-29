<?php

namespace Modules\Auth\Exceptions;


use RuntimeException;
class NoAuthDiscoveryCaseFoundException extends RuntimeException {

    protected $message='No Auth Discovery Case found.';

}
