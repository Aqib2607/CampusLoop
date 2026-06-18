<?php

namespace App\Http\Requests\Marketplace;

use Illuminate\Foundation\Http\FormRequest;

class CreateListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => 'required|string|min:5|max:200',
            'description' => 'required|string|min:10|max:5000',
            'price'       => 'required|numeric|min:0|max:9999999',
            'category_id' => 'required|integer|exists:categories,id',
            'condition'   => 'required|in:new,like_new,good,fair,poor',
            'negotiable'  => 'boolean',
            'location'    => 'nullable|string|max:200',
            'expiry_days' => 'nullable|integer|in:7,15,30,60',
            'images'      => 'nullable|array|max:10',
            'images.*'    => 'image|mimes:jpg,jpeg,png,webp|max:20480',
        ];
    }
}
