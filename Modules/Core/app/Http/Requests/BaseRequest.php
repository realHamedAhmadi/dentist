<?php

namespace Modules\Core\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use Modules\Core\Http\Responses\BaseApiResponse;

class BaseRequest extends FormRequest
{
    protected function isUpdating(): bool
    {
        return $this->isMethod('PUT') || $this->isMethod('PATCH');
    }

    /**
     * @throws ValidationException
     */
    protected function failedValidation(Validator $validator)
    {
        $exception = $validator->getException();

        $exception=$exception?new $exception($validator):new ValidationException($validator);

        $exception->response = response([
            'message' => $exception->getMessage() ?: 'The given data was invalid.',
            'errors' => $validator->errors(),
            'meta' => $this->validationFailedExtraData(),
        ],422);

        $exception->meta=$this->validationFailedExtraData();

        throw $exception
            ->errorBag($this->errorBag)
            ->redirectTo($this->getRedirectUrl());
    }

    protected function validationFailedExtraData():array
    {
        return [];
    }
}
