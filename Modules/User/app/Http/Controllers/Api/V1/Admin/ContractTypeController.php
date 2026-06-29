<?php

namespace Modules\User\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use Modules\User\Http\Requests\Api\V1\Admin\ContractTypeRequest;
use Modules\User\Http\Resources\Api\V1\Admin\ContractTypeResource;
use Modules\User\Services\ContractTypeService;
use Spatie\RouteAttributes\Attributes\Resource;
use Throwable;

#[Resource('contract-types')]
class ContractTypeController extends Controller
{
    public function __construct(protected ContractTypeService $service)
    {
    }

    /**
     * Display a listing of the resource.
     */

    public function index(Request $request): ResourceCollection
    {
        $records = $this->service->get($request->all(), true, $request->per_page ?? 20);

        return ContractTypeResource::collection($records);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws Throwable
     */
    public function store(ContractTypeRequest $request): ContractTypeResource
    {
        $record = $this->service->create($request->validated());
        return new ContractTypeResource($record);
    }

    /**
     * Show the specified resource.
     *
     * @throws ModelNotFoundException
     */
    public function show(int $id): ContractTypeResource
    {
        $record = $this->service->find($id);

        return new ContractTypeResource($record);
    }

    /**
     * Update the specified resource in storage.
     *
     * @throws ModelNotFoundException|Throwable
     */
    public function update(ContractTypeRequest $request, int $id): ContractTypeResource
    {
        $record = $this->service->update($request->validated(), $id);
        return new ContractTypeResource($record);
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
