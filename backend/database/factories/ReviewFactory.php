<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\User;
use App\Models\Listing;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition(): array
    {
        return [
            'reviewer_id' => User::factory(),
            'reviewed_user_id' => User::factory(),
            'listing_id' => Listing::factory(),
            'rating' => fake()->numberBetween(1, 5),
            'review_text' => fake()->realText(150),
        ];
    }
}
