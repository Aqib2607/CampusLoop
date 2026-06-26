<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Books & Notes', 'icon' => 'BookOpen'],
            ['name' => 'Electronics', 'icon' => 'Laptop'],
            ['name' => 'Lab Equipment', 'icon' => 'Microscope'],
            ['name' => 'Student Essentials', 'icon' => 'Backpack'],
        ];

        foreach ($categories as $sortOrder => $attributes) {
            $category = Category::withTrashed()->updateOrCreate(
                ['slug' => Str::slug($attributes['name'])],
                $attributes + ['status' => true, 'sort_order' => $sortOrder + 1],
            );

            if ($category->trashed()) {
                $category->restore();
            }
        }

        Category::query()
            ->whereNotIn('slug', array_map(fn (array $category) => Str::slug($category['name']), $categories))
            ->update(['status' => false]);
    }
}
