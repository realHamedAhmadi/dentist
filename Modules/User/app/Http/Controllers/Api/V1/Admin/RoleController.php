<?php

namespace Modules\User\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use Modules\User\Http\Requests\Api\V1\Admin\RoleRequest;
use Modules\User\Http\Resources\Api\V1\Admin\RoleResource;
use Modules\User\Services\RoleService;
use Spatie\RouteAttributes\Attributes\Resource;
use Throwable;

#[Resource('roles')]
class RoleController extends Controller
{
    public function __construct(protected RoleService $service)
    {
    }

    /**
     * Display a listing of the resource.
     */

    public function index(Request $request): ResourceCollection
    {
        $records = $this->service->get($request->all(), true, $request->per_page ?? 20);

        return RoleResource::collection($records);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws Throwable
     */
    public function store(RoleRequest $request): RoleResource
    {
        $record = $this->service->create($request->validated());
        return new RoleResource($record);
    }

    /**
     * Show the specified resource.
     *
     * @throws ModelNotFoundException
     */
    public function show(int $id): RoleResource
    {
        $record = $this->service->find($id);

        return new RoleResource($record);
    }

    /**
     * Update the specified resource in storage.
     *
     * @throws ModelNotFoundException|Throwable
     */
    public function update(RoleRequest $request, int $id): RoleResource
    {
        $record = $this->service->update($request->validated(), $id);
        return new RoleResource($record);
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
