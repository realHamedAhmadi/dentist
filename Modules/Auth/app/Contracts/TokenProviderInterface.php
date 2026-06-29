<?php

namespace Modules\Auth\Contracts;

use JetBrains\PhpStorm\ArrayShape;
use Modules\Auth\DTO\TokenProviderResult;
use Modules\User\Models\User;

interface TokenProviderInterface {
    public function issueFor(User $user, array $opts = []): TokenProviderResult; // returns token info (token string, meta)
    public function revokeFor(?User $user=null, array $opts = []): bool;
}
