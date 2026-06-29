<?php

namespace Modules\User\Http\Requests\Api\V1\Admin;

use Illuminate\Validation\Rule;
use JetBrains\PhpStorm\ArrayShape;
use Modules\Core\Http\Requests\Api\V1\VersionRequest;
use Modules\Core\Models\DevSetting;
use Modules\User\Enums\ShareType;
use Modules\User\Http\Resources\Api\V1\Admin\UserResource;
use Modules\User\Models\Owner;
use Modules\User\Models\User;
use Modules\User\Traits\SomeRule;

class OwnerRequest extends VersionRequest
{
    use SomeRule;

    protected static string $devSetting = DevSetting::class;

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $required = 'required';
        if ($this->isUpdating())
            $required = 'sometimes';

        $uTbl = User::table();
        $oTbl=Owner::table();
        $shareTypes = join(',', ShareType::values());
        $rules = [
            'id'=>'prohibited',
            'user_id'=>'prohibited',
            'first_name' => "$required|min:3|string",
            'last_name' => "nullable|min:3|string",
            'is_active' => 'sometimes|in:1,0',
            'address' => 'nullable|string',
            'share_type' => "$required|in:$shareTypes",
            'share_value' => [$required,'numeric', 'min:0',
                Rule::when(
                    $this->share_type == ShareType::PERCENTAGE->value, ['max:100']
                )
            ]
        ];

        if ($this->isUpdating()) {
            $owner = $this->route('owner');
            $owner = is_object($owner) ? $owner : Owner::findOrFail($owner);
            $rules['phone'] = $this->getPhoneRule();
            $rules['phone'][] = "unique:$uTbl,phone,{$owner->user_id}";
            $rules['national_code'] = $this->getNationalCodeRule();
            $rules['national_code'][] = "unique:$oTbl,national_code,{$owner->id}";
        } else {
            $rules['phone'] = $this->getPhoneRule();
            $rules['phone'][] = $this->getUniquePhoneRule('owner');
            $rules['national_code'] = $this->getNationalCodeRule();
            $rules['national_code'][] = "unique:$oTbl,national_code";
        }

        return $rules;
    }

    #[ArrayShape(['unrelated_user' => UserResource::class . '|null'])]
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
