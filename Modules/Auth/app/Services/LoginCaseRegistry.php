<?php

namespace Modules\Auth\Services;

use Modules\Auth\Contracts\LoginStrategyInterface;
use Modules\Auth\Services\LoginCases\LoginByEmail;
use Modules\Auth\Services\LoginCases\LoginByPhone;

class LoginCaseRegistry
{
    /** @var class-string<LoginStrategyInterface>[] */
    protected array $cases = [
        LoginByPhone::class,
        LoginByEmail::class,
    ];

    /** @var LoginStrategyInterface[] */
    protected array $instances = [];

    public function __construct()
    {
        foreach ($this->cases as $caseClass) {
            $this->instances[] = app($caseClass); // resolve once
        }
    }

    public function enabled(): array
    {
        return array_filter($this->instances, fn($obj) => $obj->isEnable());
    }

    public function all(): array
    {
        return $this->instances;
    }
}

