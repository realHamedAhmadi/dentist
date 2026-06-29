<?php

namespace Modules\User\Http\Resources\Api\V1\Admin;

use Illuminate\Http\Request;
use Modules\Core\Http\Resources\Api\V1\VersionResource;

class ShiftResource extends VersionResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'name'=>$this->name,
            'start_time'=>$this->start_time,
            'end_time'=>$this->end_time,
        ];
    }
}
