<?php

namespace Modules\User\Traits;

use Illuminate\Support\Str;
use Modules\User\Models\User;

trait SomeRule
{
    protected ?User $unrelatedUser=null;

    protected function getNationalCodeRule(): array
    {
        $min = static::$devSetting::minNationalCodeLength();
        $max = static::$devSetting::maxNationalCodeLength();
        $rule = ['nullable'];
        $r = null;
        if (static::$devSetting::nationalCodeIsNumeric()) {
            $rule[] = 'numeric';
            $r = "digits:$max";
            if ($min != $max)
                $r = "digits_between:$min,$max";
        } else {
            $rule[] = 'string';
            $r = "size:$max";
            if ($min != $max)
                $r = "between:$min,$max";
        }
        $rule[] = $r;
        return $rule;
    }

    protected function getPhoneRule(): array
    {
        $min = static::$devSetting::minPhoneLength()+1;
        $max = static::$devSetting::maxPhoneLength()+1;
        $required = 'required';
        if ($this->isUpdating())
            $required = 'sometimes';

        $rule = [$required,'numeric'];
        $r = "digits:$max";
        if ($min != $max)
            $r = "digits_between:$min,$max";
        $rule[]=$r;
        return $rule;
    }

    protected function getUniquePhoneRule($relation): \Closure
    {
        return function ($attribute, $value, $fail)use($relation) {
            $user = User::where('phone', $value)->first();
            if ($user and ($this->create_for_user!=$user->id)) {
                $this->unrelatedUser=$user;
                $fail(trans('validation.unique', ['attribute' => Str::snake($attribute)]));
            }
        };
    }
}
