<?php

namespace Modules\Auth\DTO;

use JetBrains\PhpStorm\ArrayShape;

class TokenProviderResult
{
    public function __construct(
        public readonly string $driver,
        public readonly ?string $token=null,
        public readonly ?string $tokenType=null,
    )
    {
    }

    public static function session():self
    {
        return new self(
            driver: 'session'
        );
    }

    public static function sanctum(string $token,string $tokenType='Bearer'):self
    {
        return new self(
            driver: 'sanctum',
            token: $token ,
            tokenType: $tokenType
        );
    }

    #[ArrayShape([
        'driver' => "string",
        'token' => "string|null",
        'token_type'=>'string|null'
    ])]
    public function toArray():array
    {
        return [
            'driver'=>$this->driver,
            'token'=>$this->token,
            'token_type'=>$this->tokenType
        ];
    }
}
