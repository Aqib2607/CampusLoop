<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'        => 'sometimes|string|min:2|max:100',
            'username'    => 'sometimes|string|min:3|max:50|unique:users,username,' . $this->user()->id . '|regex:/^[a-zA-Z0-9_]+$/',
            'phone'       => 'nullable|string|max:20',
            'bio'         => 'nullable|string|max:500',
            'university'  => 'nullable|string|max:200',
            'department'  => 'nullable|string|max:200',
        ];
    }
}
