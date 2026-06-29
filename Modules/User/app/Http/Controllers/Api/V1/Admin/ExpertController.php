<?php

namespace Modules\User\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use Modules\User\Http\Requests\Api\V1\Admin\ExpertRequest;
use Modules\User\Http\Resources\Api\V1\Admin\ExpertResource;
use Modules\User\Services\ExpertService;
use Spatie\RouteAttributes\Attributes\Resource;
use Throwable;

#[Resource('experts')]
class ExpertController extends Controller
{
    public function __construct(protected ExpertService $service){}

    /**
     * Display a listing of the resource.
     */

    public function index(Request $request):ResourceCollection
    {
        $records=$this->service->get($request->all(),true,$request->per_page??20);

        return ExpertResource::collection($records);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws Throwable
     */
    public function store(ExpertRequest $request):ExpertResource
    {
        if ($request->create_for_user)
            $record = $this->service->createForUser($request->validated(), $request->create_for_user);
        else
            $record = $this->service->create($request->validated());
        return new ExpertResource($record);
    }

    /**
     * Show the specified resource.
     *
     * @throws ModelNotFoundException
     */
    public function show(int $id):ExpertResource
    {
        $record=$this->service->find($id);

        return new ExpertResource($record);
    }

    /**
     * Update the specified resource in storage.
     *
     * @throws ModelNotFoundException|Throwable
     */
    public function update(ExpertRequest $request, int $id):ExpertResource
    {
        $record=$this->service->update($request->validated(),$id);
        return new ExpertResource($record);
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
