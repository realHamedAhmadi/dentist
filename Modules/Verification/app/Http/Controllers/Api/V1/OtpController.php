<?php

namespace Modules\Auth\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Modules\Core\Http\Responses\Api\V1\VersionResponse;
use Modules\Verification\Enums\VerificationPurpose;
use Modules\Verification\Http\Requests\Api\V1\OtpRequest;
use Modules\Verification\Services\VerificationService;
use Spatie\RouteAttributes\Attributes\Group;
use Spatie\RouteAttributes\Attributes\Post;

#[Group(
    prefix: 'otp',
    as: 'otp.'
)]
class OtpController extends Controller
{
    public function __construct(
        protected readonly VerificationService $service
    )
    {
    }

    /**
     * set request
     */
    #[Post('request','request')]
    public function request(OtpRequest $request): JsonResponse
    {
        $result=$this->service->request($request->identifier,VerificationPurpose::DEFAULT);
        return VersionResponse::success()
            ->data($result->data())
            ->meta($result->meta())
            ->toResponse();
    }

    /**
     * verify
     */
    #[Post('verify','verify')]
    public function verify(OtpRequest $request): JsonResponse
    {
        $result = $this->service->verify($request->identifier,$request->code,VerificationPurpose::DEFAULT);

        return VersionResponse::success()
            ->data($result->data())
            ->meta($result->meta())
            ->toResponse();
    }

    /**
     * resend
     */
    #[Post('resend', 'resend')]
    public function resend(OtpRequest $request): JsonResponse
    {
        $result = $this->service->resend($request->identifier,VerificationPurpose::DEFAULT);
        return VersionResponse::success()
            ->data($result->data())
            ->meta($result->meta())
            ->toResponse();
    }
}
