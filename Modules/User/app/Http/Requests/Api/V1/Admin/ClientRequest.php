<?php

namespace Modules\User\Http\Requests\Api\V1\Admin;

use Modules\Core\Http\Requests\Api\V1\VersionRequest;
use Modules\User\Traits\SomeRule;


class ClientRequest extends VersionRequest
{
    use SomeRule;
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'id'=>'prohibited',
            'user_id'=>'prohibited',
            'first_name'=>'required|min:3|string',
            'last_name'=>'nullable|min:3|string',
            'phone'=>'required|numeric|digits:11',
            'is_active'=>'nullable|in:1,0',
            'national_code'=>$this->getNationalCodeRule(),
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
