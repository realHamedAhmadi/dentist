<?php

namespace Modules\Core\Http\Responses;

use Illuminate\Http\JsonResponse;

class BaseApiResponse
{
    protected bool $success = true;
    protected ?string $code = null;
    protected ?string $message = null;
    protected mixed $data = null;
    protected mixed $errors = null;
    protected array $meta = [];
    protected array $links = [];


    public function toResponse(int $status = 200): JsonResponse
    {
        if ($this->success) {
            return $this->successJsonResponse($status);
        }
        return $this->errorJsonResponse($status);
    }

    /* ---------- Fluent builders ---------- */

    public static function success(): static
    {
        $instance = new static();
        $instance->success = true;
        return $instance;
    }

    public static function error(?string $code = null): static
    {
        $instance = new static();
        $instance->success = false;
        $instance->code = $code;
        $instance->message = trans($code) ?? $instance->message;
        return $instance;
    }

    public function message(string $message): static
    {
        $this->message = $message;
        return $this;
    }

    public function data(mixed $data): static
    {
        if (!is_array($data)) {
            $data = (array)$data; // convert objects or scalar to array
        }
        $this->data = $data;
        return $this;
    }

    public function errors(mixed $errors): static
    {
        $this->errors = $errors;
        return $this;
    }

    public function meta(array $meta): static
    {
        $this->meta = $meta;
        return $this;
    }

    public function links(array $links): static
    {
        $this->links = $links;
        return $this;
    }



    protected function successJsonResponse(int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->data,
            'links' => (object)$this->links,
            'meta' => (object)$this->meta,
        ], $status);
    }

    protected function errorJsonResponse(int $status = 400): JsonResponse
    {
        return response()->json([
            'success' => false,
            'code' => $this->code,
            'message' => $this->message,
            'errors' => $this->errors,
            'links' => (object)$this->links,
            'meta' => (object)$this->meta,
        ], $status);
    }
}

