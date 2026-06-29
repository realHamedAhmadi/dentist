<?php

namespace Modules\User\Http\Requests\Api\V1\Admin;

use Modules\Core\Http\Requests\Api\V1\VersionRequest;
use Modules\User\Models\Definition\Position;

class PositionRequest extends VersionRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $required = 'required';
        if ($this->isUpdating())
            $required = 'sometimes';
        $pTbl=Position::table();
        $rules = [
            'id'=>'prohibited',
            'name' => "$required|min:3|max:64|string",
            'code' => "nullable|string|unique:$pTbl,code",
            'description' => 'nullable|string|max:150',
        ];

        if ($this->isUpdating()) {
            $position = $this->route('position');
            $position = is_object($position) ? $position : Position::findOrFail($position);
            $rules['code'].=",{$position->id}";
        }

        return $rules;
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
