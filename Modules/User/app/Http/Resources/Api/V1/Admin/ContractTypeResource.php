<?php

namespace Modules\User\Http\Resources\Api\V1\Admin;

use Illuminate\Http\Request;
use Modules\Core\Http\Resources\Api\V1\VersionResource;

class ContractTypeResource extends VersionResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'name'=>$this->name,
        ];
    }
}
