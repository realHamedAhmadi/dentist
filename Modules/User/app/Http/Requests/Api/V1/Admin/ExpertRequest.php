<?php

namespace Modules\User\Http\Requests\Api\V1\Admin;

use JetBrains\PhpStorm\ArrayShape;
use Modules\Core\Http\Requests\Api\V1\VersionRequest;
use Modules\Core\Models\DevSetting;
use Modules\User\Enums\ShareType;
use Modules\User\Http\Resources\Api\V1\Admin\UserResource;
use Modules\User\Models\Definition\Specialty;
use Modules\User\Models\Expert;
use Modules\User\Models\User;
use Modules\User\Traits\SomeRule;

class ExpertRequest extends VersionRequest
{
    use SomeRule;

    protected static string $devSetting=DevSetting::class;

    protected function prepareForValidation()
    {
        $specialties = $this->input('specialties', []);

        foreach ($specialties as $index => $item) {
            if (($item['share_type'] ?? null) === ShareType::PERCENTAGE->value) {
                $item['share_value'] = min($item['share_value'] ?? 0, 100);
            }
            $specialties[$index] = $item;
        }

        $this->merge(['specialties' => $specialties]);
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
        $eTbl=Expert::table();
        $sTbl = Specialty::table();
        $shareTypes = join(',', ShareType::values());
        $rules= [
            'id'=>'prohibited',
            'user_id'=>'prohibited',
            'first_name' => "$required|min:3|string",
            'last_name' => "nullable|min:3|string",
            'is_active' => 'sometimes|in:1,0',
            'address'=>'nullable|string',
            'specialties' => 'sometimes|array',
            'specialties.*.id' => "required_with:specialties|exists:$sTbl,id",
            'specialties.*.share_type' => "required_with:specialties|in:$shareTypes",
            'specialties.*.share_value' => 'required_with:specialties|numeric|min:0',
            'expert_weekly_schedules'=>'sometimes|array',
            'expert_weekly_schedules.*.day'=>'required_with:expert_weekly_schedules|numeric|between:1,7',
            'expert_weekly_schedules.*.starts_at'=>'required_with:expert_weekly_schedules|numeric|between:0,23',
            'expert_weekly_schedules.*.ends_at'=>'required_with:expert_weekly_schedules|numeric|between:0,23',
        ];

        if ($this->isUpdating()) {
            $expert=$this->route('expert');
            $expert = is_object($expert) ? $expert : Expert::findOrFail($expert);
            $rules['phone'] = $this->getPhoneRule();
            $rules['phone'][]="unique:$uTbl,phone,{$expert->user_id}";
            $rules['license_number']="nullable|string|min:3|unique:$eTbl,license_number,{$expert->id}";
        } else {
            $rules['phone'] = $this->getPhoneRule();
            $rules['phone'][] = $this->getUniquePhoneRule('expert');
            $rules['license_number']="nullable|string|min:3|unique:$eTbl,license_number";
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
