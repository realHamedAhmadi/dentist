<?php

namespace Modules\User\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use Modules\User\Http\Requests\Api\V1\Admin\AdminRequest;
use Modules\User\Http\Resources\Api\V1\Admin\AdminResource;
use Modules\User\Services\AdminService;
use Spatie\RouteAttributes\Attributes\Resource;
use Throwable;

#[Resource('admins')]
class AdminController extends Controller
{
    public function __construct(protected AdminService $service)
    {
    }

    /**
     * Display a listing of the resource.
     */

    public function index(Request $request): ResourceCollection
    {
        $records = $this->service->get($request->all(), true, $request->per_page ?? 20);

        return AdminResource::collection($records);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws Throwable
     */
    public function store(AdminRequest $request): AdminResource
    {
        if ($request->create_for_user)
            $record = $this->service->createForUser($request->validated(), $request->create_for_user);
        else
            $record = $this->service->create($request->validated());
        return new AdminResource($record);
    }

    /**
     * Show the specified resource.
     *
     * @throws ModelNotFoundException
     */
    public function show(int $id): AdminResource
    {
        $record = $this->service->find($id);

        return new AdminResource($record);
    }

    /**
     * Update the specified resource in storage.
     *
     * @throws ModelNotFoundException|Throwable
     */
    public function update(AdminRequest $request, int $id): AdminResource
    {
        $record = $this->service->update($request->validated(), $id);
        return (new AdminResource($record));
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
