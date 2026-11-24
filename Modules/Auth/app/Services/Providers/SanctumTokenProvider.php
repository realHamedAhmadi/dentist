<?php

namespace Modules\Auth\Services\Providers;

use Modules\Auth\Contracts\TokenProviderInterface;
use Modules\Auth\DTO\TokenProviderResult;
use Modules\User\Models\User;

class SanctumTokenProvider implements TokenProviderInterface
{
    public function issueFor(User $user, array $opts = []): TokenProviderResult
    {
        $token = $user->createToken($opts['token_name'] ?? 'api-token')->plainTextToken;

        return TokenProviderResult::sanctum(token: $token);
    }

    public function revokeFor(?User $user = null, array $opts = []): bool
    {
        // Delete the current access token from personal_access_tokens
        $user?->currentAccessToken()?->delete();

        return true;
    }
}
