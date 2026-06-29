<?php

namespace Modules\User\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use Modules\User\Http\Requests\Api\V1\Admin\ClientRequest;
use Modules\User\Http\Resources\Api\V1\Admin\ClientResource;
use Modules\User\Services\ClientService;
use Spatie\RouteAttributes\Attributes\Resource;
use Throwable;

#[Resource('clients')]
class ClientController extends Controller
{
    public function __construct(protected ClientService $service){}

    /**
     * Display a listing of the resource.
     */

    public function index(Request $request):ResourceCollection
    {
        $records=$this->service->get($request->all(),true,$request->per_page??20);

        return ClientResource::collection($records);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws Throwable
     */
    public function store(ClientRequest $request):ClientResource
    {
        $record=$this->service->create($request->validated());

        return new ClientResource($record);
    }

    /**
     * Show the specified resource.
     *
     * @throws ModelNotFoundException
     */
    public function show(int $id):ClientResource
    {
        $record=$this->service->find($id);

        return new ClientResource($record);
    }

    /**
     * Update the specified resource in storage.
     *
     * @throws ModelNotFoundException|Throwable
     */
    public function update(ClientRequest $request, int $id):ClientResource
    {
        $record=$this->service->update($request->validated(),$id);
        return new ClientResource($record);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @throws ModelNotFoundException
     */
    public function destroy(int $id):Response
    {
        $this->service->delete($id);

        return response()->noContent();
    }
}
