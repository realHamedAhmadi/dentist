<?php

namespace Modules\Auth\Services\Auth\Providers;


use Illuminate\Support\Facades\Auth;
use Modules\Auth\Contracts\TokenProviderInterface;
use Modules\Auth\DTO\TokenProviderResult;
use Modules\User\Models\User;

class SessionTokenProvider implements TokenProviderInterface
{
    public function issueFor(User $user, array $opts = []): TokenProviderResult
    {
        Auth::login($user, $opts['remember'] ?? false);
        return TokenProviderResult::session();
    }

    public function revokeFor(?User $user=null, array $opts = []): bool
    {
        Auth::logout();
        return true;
    }
}

