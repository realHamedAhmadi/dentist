<?php

namespace Modules\User\Http\Resources\Api\V1\Admin;

use Illuminate\Http\Request;
use Modules\Core\Http\Resources\Api\V1\VersionResource;

class StaffResource extends VersionResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'user_id'=>$this->user_id,
            'full_name'=>$this->full_name,
            'first_name'=>$this->first_name,
            'last_name'=>$this->last_name,
            'phone'=>$this->phone,
            'is_active'=>$this->is_active,
            'position'=>$this->position,
            'shift'=>$this->shift,
            'contract_ype'=>$this->contractType,
            'hire_date'=>toLocalCalendar($this->hire_date),
            'end_date'=>toLocalCalendar($this->end_date),
            'national_code'=>$this->national_code,
            'employee_code'=>$this->employee_code,
            'address'=>$this->address,
        ];
    }
}
