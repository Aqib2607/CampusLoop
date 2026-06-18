<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Listing;
use App\Models\Category;
use App\Models\User;

class ListingSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::pluck('id')->toArray();
        $users = User::pluck('id')->toArray();

        if (empty($categories) || empty($users)) return;

        // Requirements: 3000 listings.
        // Published: 2200, Pending: 250, Approved: 150, Rejected: 100, Paused: 100, Sold: 150, Archived: 50
        $distributions = [
            'published' => 2200,
            'pending' => 250,
            'approved' => 150,
            'rejected' => 100,
            'paused' => 100,
            'sold' => 150,
            'archived' => 50,
        ];

        foreach ($distributions as $status => $count) {
            $listings = [];
            for ($i = 0; $i < $count; $i++) {
                $soldAt = $status === 'sold' ? fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d H:i:s') : null;
                $listings[] = [
                    'user_id' => fake()->randomElement($users),
                    'category_id' => fake()->randomElement($categories),
                    'title' => fake()->catchPhrase(),
                    'description' => fake()->realText(300),
                    'price' => fake()->randomFloat(2, 50, 5000),
                    'condition' => fake()->randomElement(['new', 'like_new', 'good', 'fair', 'poor']),
                    'negotiable' => fake()->boolean(70),
                    'status' => $status,
                    'expiry_date' => fake()->dateTimeBetween('now', '+2 months')->format('Y-m-d H:i:s'),
                    'sold_at' => $soldAt,
                    'view_count' => fake()->numberBetween(0, 500),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Bulk insert chunked
            $chunks = array_chunk($listings, 500);
            foreach ($chunks as $chunk) {
                Listing::insert($chunk);
            }
        }
    }
}
