<?php

namespace Modules\User\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use Modules\User\Http\Requests\Api\V1\Admin\StaffRequest;
use Modules\User\Http\Resources\Api\V1\Admin\StaffResource;
use Modules\User\Services\StaffService;
use Spatie\RouteAttributes\Attributes\Resource;
use Throwable;

#[Resource('staff')]
class StaffController extends Controller
{
    public function __construct(protected StaffService $service)
    {
    }

    /**
     * Display a listing of the resource.
     */

    public function index(Request $request): ResourceCollection
    {
        $records = $this->service->get($request->all(), true, $request->per_page ?? 20);

        return StaffResource::collection($records);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws Throwable
     */
    public function store(StaffRequest $request): StaffResource
    {
        if ($request->create_for_user)
            $record = $this->service->createForUser($request->validated(), $request->create_for_user);
        else
            $record = $this->service->create($request->validated());
        return new StaffResource($record);
    }

    /**
     * Show the specified resource.
     *
     * @throws ModelNotFoundException
     */
    public function show(int $id): StaffResource
    {
        $record = $this->service->find($id);

        return new StaffResource($record);
    }

    /**
     * Update the specified resource in storage.
     *
     * @throws ModelNotFoundException|Throwable
     */
    public function update(StaffRequest $request, int $id): StaffResource
    {
        $record = $this->service->update($request->validated(), $id);
        return new StaffResource($record);
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
