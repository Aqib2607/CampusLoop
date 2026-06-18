<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'                  => 'required|string|min:2|max:100',
            'email'                 => 'required|email|unique:users,email|max:255',
            'password'              => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
            'username'              => 'nullable|string|min:3|max:50|unique:users,username|regex:/^[a-zA-Z0-9_]+$/',
            'phone'                 => 'nullable|string|max:20',
            'university'            => 'nullable|string|max:200',
            'department'            => 'nullable|string|max:200',
        ];
    }
}
