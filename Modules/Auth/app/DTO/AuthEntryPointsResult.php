<?php

namespace Modules\Auth\DTO;

use Modules\Core\Contracts\DTO\BaseDtoInterface;
use Modules\Core\DTO\BaseDTO;

class AuthEntryPointsResult extends BaseDTO implements BaseDtoInterface
{
    public function __construct(
        public readonly array $loginCases,
    )
    {
    }

    public function data(): array
    {
        return [];
    }

    public function meta(): array
    {
        return [
            'login_cases' => $this->loginCases,
        ];
    }
}
