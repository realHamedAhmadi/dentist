<?php

namespace App\DTO;

final readonly class CreateTenantData
{
    public function __construct(
        public string $name,
        public string $slug,
        public ?string $domain = null,
        public array $meta = [],
    ) {}

    public static function from(array $data): self
    {
        return new self(
            name: $data['name'],
            slug: $data['slug'],
            domain: $data['domain'] ?? null,
            meta: $data['meta'] ?? [],
        );
    }
}
