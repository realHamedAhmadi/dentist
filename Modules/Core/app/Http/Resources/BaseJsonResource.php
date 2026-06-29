<?php

namespace Modules\Core\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Modules\Core\Http\Responses\BaseApiResponse;

class BaseJsonResource extends JsonResource
{
    public static function collection($resource): BaseResourceCollection
    {
        return new class($resource) extends BaseResourceCollection{};
    }

    public function toResponse($request): \Illuminate\Http\JsonResponse
    {
        return $this->responseClass()::success()
            ->data($this->resolve($request))
            ->meta(array_merge($this->with($request) ?? [], $this->additional ?? []))
            ->toResponse();
    }

    protected function responseClass():string
    {
        $class = getVersionResponseClass();
        if (!class_exists($class)) {
            $class = BaseApiResponse::class; // fallback
        }
        return $class;
    }
}
