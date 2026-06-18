<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConversationFactory extends Factory
{
    protected $model = Conversation::class;

    public function definition(): array
    {
        return [
            'listing_id' => Listing::factory(),
            'buyer_id' => User::factory(),
            'seller_id' => User::factory(),
            'status' => fake()->randomElement(['active', 'active', 'active', 'blocked', 'closed']),
        ];
    }
}
