<?php

namespace Modules\Auth\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\Auth\Http\Requests\Api\V1\DiscoveryRequest;
use Modules\Auth\Http\Requests\Api\V1\LoginRequest;
use Modules\Auth\Services\AuthDiscoveryService;
use Modules\Auth\Services\AuthEntryPointsService;
use Modules\Auth\Services\AuthService;
use Modules\Core\Http\Responses\Api\V1\VersionResponse;
use Spatie\RouteAttributes\Attributes\Get;
use Spatie\RouteAttributes\Attributes\Group;
use Spatie\RouteAttributes\Attributes\Post;

#[Group(prefix: 'auth', as: 'auth.')]
class AuthController extends Controller
{
    /** Get capabilities */
    #[Get('/', 'entry-points')]
    public function index(AuthEntryPointsService $service): JsonResponse
    {
        $result = $service->get();

        return VersionResponse::success()
            ->data($result->data())
            ->meta($result->meta())
            ->toResponse();
    }

    /** Set login */
    #[Post('/', 'login')]
    public function store(LoginRequest $request, AuthService $service): JsonResponse
    {
        $result = $service->login($request->identifier, $request->credential, $request->validated());

        return VersionResponse::success()
            ->data($result->data())
            ->meta($result->meta())
            ->toResponse();
    }

    /** Get discovery identifier */
    #[Get('discovery', 'discovery')]
    public function discovery(DiscoveryRequest $request, AuthDiscoveryService $service): JsonResponse
    {
        $result = $service->discover($request->identifier);

        return VersionResponse::success()
            ->data($result->data())
            ->meta($result->meta())
            ->toResponse();
    }

    /** Logout the authenticated user */
    #[Post('logout', 'logout')]
    public function logout(Request $request, AuthService $service): JsonResponse
    {
        // Pass the authenticated user so the token provider can revoke the correct token
        $service->logout($request->user());

        return VersionResponse::success()
            ->meta(['logged_out_at' => now()])
            ->toResponse();
    }
}
