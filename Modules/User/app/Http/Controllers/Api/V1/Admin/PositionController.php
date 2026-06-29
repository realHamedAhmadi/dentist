<?php

namespace Modules\User\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use Modules\User\Http\Requests\Api\V1\Admin\PositionRequest;
use Modules\User\Http\Resources\Api\V1\Admin\PositionResource;
use Modules\User\Services\PositionService;
use Spatie\RouteAttributes\Attributes\Resource;
use Throwable;

#[Resource('positions')]
class PositionController extends Controller
{
    public function __construct(protected PositionService $service)
    {
    }

    /**
     * Display a listing of the resource.
     */

    public function index(Request $request): ResourceCollection
    {
        $records = $this->service->get($request->all(), true, $request->per_page ?? 20);

        return PositionResource::collection($records);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws Throwable
     */
    public function store(PositionRequest $request): PositionResource
    {
        $record = $this->service->create($request->validated());
        return new PositionResource($record);
    }

    /**
     * Show the specified resource.
     *
     * @throws ModelNotFoundException
     */
    public function show(int $id): PositionResource
    {
        $record = $this->service->find($id);

        return new PositionResource($record);
    }

    /**
     * Update the specified resource in storage.
     *
     * @throws ModelNotFoundException|Throwable
     */
    public function update(PositionRequest $request, int $id): PositionResource
    {
        $record = $this->service->update($request->validated(), $id);
        return new PositionResource($record);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @throws ModelNotFoundException
     */
    public function destroy(int $id): Response
    {
        $this->service->delete($id);

        return response()->noContent();
    }
}
