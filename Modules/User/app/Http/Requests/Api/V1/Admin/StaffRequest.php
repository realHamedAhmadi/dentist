<?php

namespace Modules\User\Http\Requests\Api\V1\Admin;

use JetBrains\PhpStorm\ArrayShape;
use Modules\Core\Http\Requests\Api\V1\VersionRequest;
use Modules\Core\Models\DevSetting;
use Modules\User\Http\Resources\Api\V1\Admin\UserResource;
use Modules\User\Models\Definition\ContractType;
use Modules\User\Models\Definition\Position;
use Modules\User\Models\Definition\Shift;
use Modules\User\Models\Staff;
use Modules\User\Models\User;
use Modules\User\Traits\SomeRule;


class StaffRequest extends VersionRequest
{
    use SomeRule;
    protected static string $devSetting=DevSetting::class;

    protected function prepareForValidation()
    {
        try {
            if ($this->hire_date)
                $this->merge(['hire_date' => toGregorian($this->hire_date)]);

        } catch (\Throwable $e) {
            $this->merge(['hire_date' => 'not valid']);
        }

        try {
            if ($this->end_date)
                $this->merge(['end_date' => toGregorian($this->end_date)]);
        } catch (\Throwable $e) {
            $this->merge(['hire_date' => 'not valid']);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $required = 'required';
        if ($this->isUpdating())
            $required = 'sometimes';

        $uTbl = User::table();
        $sTbl = Staff::table();
        $pTbl = Position::table();
        $shTbl = Shift::table();
        $ctTbl = ContractType::table();
        $rules = [
            'id'=>'prohibited',
            'user_id'=>'prohibited',
            'first_name' => "$required|min:3|string",
            'last_name' => "nullable|min:3|string",
            'position_id' => "nullable|exists:$pTbl,id",
            'shift_id' => "nullable|exists:$shTbl,id",
            'contract_type_id' => "nullable|exists:$ctTbl,id",
            'national_code' => $this->getNationalCodeRule(),
            'is_active' => 'sometimes|in:1,0',
            'hire_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d|after:hire_date',
            'address' => 'nullable|string',
        ];

        if ($this->isUpdating()) {
            $staff = $this->route('staff');
            $staff = is_object($staff) ? $staff : Staff::findOrFail($staff);
            $rules['phone']=$this->getPhoneRule();
            $rules['phone'][]="unique:$uTbl,phone,{$staff->user_id}";
            $rules['employee_code'] = "nullable|unique:$sTbl,employee_code,{$staff->id}";
        } else {
            $rules['phone']=$this->getPhoneRule();
            $rules['phone'][]=$this->getUniquePhoneRule('staff');
            $rules['employee_code'] = "nullable|unique:$sTbl,employee_code";
        }

        return $rules;
    }

    #[ArrayShape(['unrelated_user' => UserResource::class.'|null'])]
    protected function validationFailedExtraData(): array
    {
        return [
            'unrelated_user' => $this->unrelatedUser ? new UserResource($this->unrelatedUser) : null,
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
