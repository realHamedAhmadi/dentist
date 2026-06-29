<?php

namespace Modules\User\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use Modules\User\Http\Requests\Api\V1\Admin\OwnerRequest;
use Modules\User\Http\Resources\Api\V1\Admin\OwnerResource;
use Modules\User\Services\OwnerService;
use Spatie\RouteAttributes\Attributes\Resource;
use Throwable;

#[Resource('owners')]
class OwnerController extends Controller
{
    public function __construct(protected OwnerService $service)
    {
    }

    /**
     * Display a listing of the resource.
     */

    public function index(Request $request): ResourceCollection
    {
        $records = $this->service->get($request->all(), true, $request->per_page ?? 20);

        return OwnerResource::collection($records);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws Throwable
     */
    public function store(OwnerRequest $request): OwnerResource
    {
        if ($request->create_for_user)
            $record = $this->service->createForUser($request->validated(), $request->create_for_user);
        else
            $record = $this->service->create($request->validated());
        return new OwnerResource($record);
    }

    /**
     * Show the specified resource.
     *
     * @throws ModelNotFoundException
     */
    public function show(int $id): OwnerResource
    {
        $record = $this->service->find($id);

        return new OwnerResource($record);
    }

    /**
     * Update the specified resource in storage.
     *
     * @throws ModelNotFoundException|Throwable
     */
    public function update(OwnerRequest $request, int $id): OwnerResource
    {
        $record = $this->service->update($request->validated(), $id);
        return new OwnerResource($record);
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
