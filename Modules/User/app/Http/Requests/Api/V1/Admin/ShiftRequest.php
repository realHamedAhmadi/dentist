<?php

namespace Modules\User\Http\Requests\Api\V1\Admin;

use Modules\Core\Http\Requests\Api\V1\VersionRequest;

class ShiftRequest extends VersionRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $required = 'required';
        if ($this->isUpdating())
            $required = 'sometimes';
        $rules = [
            'id'=>'prohibited',
            'name' => "$required|min:3|max:64|string",
            'start_time' => "$required|date_format:H:i",
            'end_time' => "$required|date_format:H:i",
        ];
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
