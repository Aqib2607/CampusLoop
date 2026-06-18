<?php

namespace App\Http\Requests\Marketplace;

use Illuminate\Foundation\Http\FormRequest;

class UpdateListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => 'sometimes|string|min:5|max:200',
            'description' => 'sometimes|string|min:10|max:5000',
            'price'       => 'sometimes|numeric|min:0|max:9999999',
            'category_id' => 'sometimes|integer|exists:categories,id',
            'condition'   => 'sometimes|in:new,like_new,good,fair,poor',
            'negotiable'  => 'boolean',
            'location'    => 'nullable|string|max:200',
        ];
    }
}
