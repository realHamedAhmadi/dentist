<?php

namespace Modules\Core\Http\Resources;

use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Modules\Core\Http\Responses\BaseApiResponse;
use Illuminate\Http\JsonResponse;

class BaseResourceCollection extends ResourceCollection
{
    public function toResponse($request): JsonResponse
    {
        $links = [];
        $pagination = [];

        if ($this->resource instanceof Paginator) {
            $pagination = [
                'current_page' => $this->resource->currentPage(),
                'last_page' => $this->resource->lastPage(),
                'per_page' => $this->resource->perPage(),
                'total' => $this->resource->total(),
            ];

            $links = [
                'prev' => $this->resource->previousPageUrl(),
                'next' => $this->resource->nextPageUrl(),
            ];
        }

        return $this->responseClass()::success()
            ->data($this->collection->toArray())
            ->meta(array_merge($this->with($request) ?? [], $this->additional ?? [], $pagination))
            ->links($links)
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

    protected function calculateStatus(): int
    {
        return 200;
    }

}
