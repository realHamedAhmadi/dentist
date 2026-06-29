<?php

namespace Modules\User\Http\Requests\Api\V1\Admin;

use Illuminate\Validation\Rule;
use Modules\Core\Http\Requests\Api\V1\VersionRequest;
use Modules\User\Models\Definition\Role;

class RoleRequest extends VersionRequest
{
    protected ?object $role=null;
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $required = 'required';
        if ($this->isUpdating()){
            $required = 'sometimes';
            $role = $this->route('role');
            $this->role = is_object($role) ? $role : Role::findOrFail($role);
        }
        $rules = [
            'id'=>'prohibited',
            'title'=>'nullable|string|min:3|max:64',
            'name'=>[$required,'string','min:3','max:64', 'regex:/^[A-Za-z0-9]+$/',
                Rule::unique(Role::table())->where(function ($q){
                    $q->where('name',$this->name)->where('guard_name',Role::GUARD_API);
                    $q->when($this->role?->id,fn($q)=>$q->where('id','!=',$this->role->id));
                })
                ]
            ];
        return $rules;
    }

    protected function passedValidation()
    {
        if ($this->has('title') and !$this->title)
            $this->merge(['title'=>$this->name??$this->role->name]);
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
