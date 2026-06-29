<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Modules\Core\Exceptions\ClientSafeException;
use Modules\Core\Http\Responses\BaseApiResponse;
use Throwable;

class ApiExceptionRenderer
{
    public function render(Throwable $exception, Request $request): ?JsonResponse
    {
        $responseClass=getVersionResponseClass();
        if (!class_exists($responseClass)) {
            $responseClass = BaseApiResponse::class; // fallback
        }

        $response = app($responseClass);

        $traceId = $this->getTraceId();

        // Validation
        if ($exception instanceof ValidationException) {
            return $response->error('validation_error')
                ->message($exception->getMessage() ?: 'The given data was invalid.')
                ->errors($exception->errors())
                ->meta(array_merge($exception->meta??[],['trace_id' => $traceId]))
                ->toResponse(422);
        }

        // Owner / ClientSafe
        if ($exception instanceof ClientSafeException) {
            if ($exception->getReport()) {
                Log::error($exception->getMessage(), ['exception' => $exception]);
            }
            $key = $exception->getErrorCode();
            $message = empty($exception->getAttributes())
                ? (trans("exceptions.{$key}_fallback") ?? $exception->getMessage())
                : trans("exceptions.{$key}", $exception->getAttributes());

            return $response->error($exception->getErrorCode())
                ->message($message)
                ->meta(array_merge(['trace_id' => $traceId], $exception->getMeta()))
                ->toResponse($exception->getStatus() ?: 400);
        }


        // Permission
        if ($exception instanceof AuthorizationException) {
            return $response->error('unauthorized')
                ->message($exception->getMessage())
                ->meta(['trace_id' => $traceId])
                ->toResponse(403);
        }

        // System error
        $status = 500;
        $message = config('app.debug') ? $exception->getMessage() : 'Internal server error';
        $errors = config('app.debug') ? ['exception' => get_class($exception)] : null;

        return $response->error('system_error')
            ->message($message)
            ->errors($errors)
            ->meta(['trace_id' => $traceId])
            ->toResponse($status);
    }

    protected function getTraceId(): string
    {
        return request()->header('X-Trace-Id') ?? (string)\Illuminate\Support\Str::uuid();
    }
}
