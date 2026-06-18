<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Conversation;
use App\Models\Listing;
use App\Models\User;

class ConversationSeeder extends Seeder
{
    public function run(): void
    {
        // Generate 2500 conversations
        $listings = Listing::with('user')->get();
        $users = User::pluck('id')->toArray();

        if ($listings->isEmpty() || empty($users)) return;

        $conversations = [];
        $uniquePairs = [];
        $now = now();

        $listingCount = $listings->count();
        
        while (count($conversations) < 2500) {
            $listing = $listings->random();
            $sellerId = $listing->user_id;
            $buyerId = fake()->randomElement($users);

            if ($buyerId === $sellerId) continue;

            $key = $listing->id . '-' . $buyerId . '-' . $sellerId;

            if (!isset($uniquePairs[$key])) {
                $uniquePairs[$key] = true;
                $conversations[] = [
                    'listing_id' => $listing->id,
                    'buyer_id' => $buyerId,
                    'seller_id' => $sellerId,
                    'status' => fake()->randomElement(['active', 'active', 'closed']),
                    'created_at' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d H:i:s'),
                ];
            }
        }

        $chunks = array_chunk($conversations, 500);
        foreach ($chunks as $chunk) {
            Conversation::insert($chunk);
        }
    }
}
