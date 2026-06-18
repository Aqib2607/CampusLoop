<?php

namespace Database\Factories;

use App\Models\Listing;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ListingFactory extends Factory
{
    protected $model = Listing::class;

    public function definition(): array
    {
        $status = fake()->randomElement(['published', 'published', 'published', 'published', 'pending', 'approved', 'rejected', 'paused', 'sold', 'archived']);
        
        return [
            'user_id' => User::factory(), // overridden in seeder usually
            'category_id' => Category::factory(), // overridden in seeder
            'title' => fake()->catchPhrase(),
            'description' => fake()->realText(300),
            'price' => fake()->randomFloat(2, 50, 5000),
            'condition' => fake()->randomElement(['new', 'like_new', 'good', 'fair', 'poor']),
            'negotiable' => fake()->boolean(70),
            'status' => $status,
            'expiry_date' => fake()->dateTimeBetween('now', '+2 months'),
            'sold_at' => $status === 'sold' ? fake()->dateTimeBetween('-1 month', 'now') : null,
            'view_count' => fake()->numberBetween(0, 500),
        ];
    }
}
