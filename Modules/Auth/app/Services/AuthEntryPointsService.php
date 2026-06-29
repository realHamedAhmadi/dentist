<?php

namespace Modules\Auth\Services;

use Modules\Auth\DTO\AuthEntryPointsResult;

class AuthEntryPointsService
{
    public function __construct(
        protected LoginCaseRegistry $registry
    ) {}

    public function get(): AuthEntryPointsResult
    {
        $types = [];

        foreach ($this->registry->enabled() as $case) {
            $types[] = $case->type()->value;
        }

        return new AuthEntryPointsResult($types);
    }
}

