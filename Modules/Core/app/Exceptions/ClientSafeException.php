<?php

namespace Modules\Core\Exceptions;

use RuntimeException;

abstract class ClientSafeException extends RuntimeException
{


    public function __construct(
        protected string $errorCode='exceptions.internal_error',
        protected int    $status = 400,
        protected array  $attributes = [],
        protected array  $meta = [],
        protected bool   $report = false
    )
    {
    }

    final public function getReport(): bool
    {
        return false;
    }

    final public function getMeta(): array
    {
        return $this->meta;
    }

    final public function getAttributes(): array
    {
        return $this->attributes;
    }

    final public function getErrorCode(): string
    {
        return $this->errorCode;
    }

    final public function getStatus(): int
    {
        return $this->status;
    }
}
