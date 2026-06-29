<?php

namespace Modules\User\Http\Resources\Api\V1\Admin;

use Illuminate\Http\Request;
use Modules\Core\Http\Resources\Api\V1\VersionResource;

class ClientResource extends VersionResource
{

    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'phone' => $this->phone,
            'is_active' => $this->is_active,
            'national_code' => $this->national_code,
            'birth_date' => $this->birth_date,
            'gender' => $this->gender,
            'father_name' => $this->father_name,
            'education' => $this->education->name ?? null,
            'job' => $this->job,
            'blood_group' => $this->bloodGroup->type ?? null,
            'is_married' => $this->is_married,
            'is_pregnant' => $this->is_pregnant,
            'address' => $this->address,
            'notes' => $this->notes,
        ];
    }
}
