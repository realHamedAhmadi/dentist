<?php

namespace Modules\User\Http\Requests\Api\V1\Admin;

use JetBrains\PhpStorm\ArrayShape;
use Modules\Core\Http\Requests\Api\V1\VersionRequest;
use Modules\Core\Models\DevSetting;
use Modules\User\Http\Resources\Api\V1\Admin\UserResource;
use Modules\User\Models\Admin;
use Modules\User\Models\Definition\Role;
use Modules\User\Models\User;
use Modules\User\Traits\SomeRule;

class AdminRequest extends VersionRequest
{
    use SomeRule;
    protected static string $devSetting=DevSetting::class;

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $required = 'required';
        if ($this->isUpdating())
            $required = 'sometimes';

        $uTbl = User::table();
        $rules = [
            'id'=>'prohibited',
            'user_id'=>'prohibited',
            'first_name' => "$required|min:3|string",
            'last_name' => "nullable|min:3|string",
            'is_active' => 'sometimes|in:1,0',
            'roles'=>'sometimes|array|exists:'.Role::table().',name'
        ];

        if ($this->isUpdating()) {
            $admin = $this->route('admin');
            $admin = is_object($admin) ? $admin : Admin::findOrFail($admin);
            $rules['phone']=$this->getPhoneRule();
            $rules['phone'][]="unique:$uTbl,phone,{$admin->user_id}";
        } else {
            $rules['phone']=$this->getPhoneRule();
            $rules['phone'][]=$this->getUniquePhoneRule('admin');
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
