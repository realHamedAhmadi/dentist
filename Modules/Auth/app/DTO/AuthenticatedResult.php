<?php

namespace Modules\Auth\DTO;

use Modules\Core\Contracts\DTO\BaseDtoInterface;
use Modules\Core\DTO\BaseDTO;
use Modules\User\Models\User;

class AuthenticatedResult extends BaseDTO implements BaseDtoInterface
{
    public function __construct(
        public readonly User $user,
        public readonly array $roles,
        public readonly array $token,
        public readonly bool $chooseRole
    ) {}

    public function data(): array
    {
        return [
            'user'=>$this->user,
        ];
    }

    public function meta(): array
    {
        return [
            'roles'=>$this->roles,
            'token'=>(object)$this->token,
            'choose_role'=>$this->chooseRole
        ];
    }
}
