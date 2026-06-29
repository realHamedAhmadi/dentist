<?php

namespace Modules\User\Http\Resources\Api\V1\Admin;

use Illuminate\Http\Request;
use Modules\Core\Http\Resources\Api\V1\VersionResource;
class UserResource extends VersionResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'full_name'=>$this->full_name,
            'first_name'=>$this->first_name,
            'last_name'=>$this->last_name,
            'phone'=>$this->phone,
            'email'=>$this->email,
        ];
    }
}
