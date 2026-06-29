<?php

namespace Modules\Auth\DTO;


use JetBrains\PhpStorm\ArrayShape;
use Modules\Core\Contracts\DTO\BaseDtoInterface;
use Modules\Verification\DTO\VerificationResult;

class AuthDiscoveryResult implements BaseDtoInterface
{
    public function __construct(
        public readonly bool                $exists,
        public readonly string              $identifier,
        public readonly array               $methods,
        public readonly ?bool               $isActive = null,
        public readonly bool                $allowRegistration = true,
        public readonly ?VerificationResult $otp = null
    )
    {
    }

    public function exists(): bool
    {
        return $this->exists;
    }

    public function isActive(): ?bool
    {
        return $this->isActive;
    }

    public function allowRegistration(): bool
    {
        return $this->allowRegistration;
    }

    #[
        ArrayShape([
            'identifier' => "string",
            'methods' => "array",
            'otp' => VerificationResult::class . '|null',
        ])]
    public function toArray(): array
    {
        return [
            'identifier' => $this->identifier,
            'methods' => $this->methods,
            'otp' => $this->otp?->toArray(),
        ];
    }

    public function data(): array
    {
        return [
            'identifier'=>$this->identifier,
        ];
    }

    public function meta(): array
    {
        return [
            'methods' => $this->methods,
            'otp' => $this->otp?->toArray(),
        ];
    }
}

