<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Books', 'icon' => 'Book'],
            ['name' => 'Electronics', 'icon' => 'Laptop'],
            ['name' => 'Furniture', 'icon' => 'Sofa'],
            ['name' => 'Lab Equipment', 'icon' => 'Microscope'],
            ['name' => 'Clothing', 'icon' => 'Shirt'],
            ['name' => 'Notes', 'icon' => 'FileText'],
            ['name' => 'Services', 'icon' => 'Tool'],
            ['name' => 'Others', 'icon' => 'Package'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate([
                'slug' => Str::slug($cat['name'])
            ], [
                'name' => $cat['name'],
                'icon' => $cat['icon'],
                'status' => true
            ]);
        }
    }
}
