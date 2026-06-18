<?php

namespace App\Http\Controllers\Marketplace;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * GET /api/v1/categories
     */
    public function index(): JsonResponse
    {
        $categories = Category::active()->orderBy('sort_order')->get();

        return response()->json([
            'success' => true,
            'data'    => $categories,
        ]);
    }

    /**
     * POST /api/v1/admin/categories  [Admin only]
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:100|unique:categories,name',
            'icon'        => 'nullable|string|max:50',
            'description' => 'nullable|string|max:500',
            'sort_order'  => 'nullable|integer',
        ]);

        $category = Category::create(array_merge($data, [
            'slug' => Str::slug($data['name']),
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Category created.',
            'data'    => $category,
        ], 201);
    }

    /**
     * PUT /api/v1/admin/categories/{id}  [Admin only]
     */
    public function update(Request $request, Category $category): JsonResponse
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:100|unique:categories,name,' . $category->id,
            'icon'        => 'nullable|string|max:50',
            'description' => 'nullable|string|max:500',
            'status'      => 'boolean',
            'sort_order'  => 'nullable|integer',
        ]);

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Category updated.',
            'data'    => $category->fresh(),
        ]);
    }

    /**
     * DELETE /api/v1/admin/categories/{id}  [Admin only]
     */
    public function destroy(Category $category): JsonResponse
    {
        if ($category->listings()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete category with active listings.',
            ], 422);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted.',
        ]);
    }
}
