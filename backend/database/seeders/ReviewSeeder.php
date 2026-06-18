<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Conversation;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        // Reviews usually happen after a successful transaction (sold listing) or a finished conversation.
        // Let's pick 2000 random closed or active conversations to leave reviews.
        $conversations = Conversation::select('id', 'listing_id', 'buyer_id', 'seller_id')
            ->inRandomOrder()
            ->limit(2000)
            ->get();

        if ($conversations->isEmpty()) return;

        $reviews = [];
        $uniquePairs = [];
        $now = now();

        foreach ($conversations as $conv) {
            // Buyer reviewing Seller
            $key1 = $conv->buyer_id . '-' . $conv->listing_id;
            if (!isset($uniquePairs[$key1])) {
                $uniquePairs[$key1] = true;
                $reviews[] = [
                    'reviewer_id' => $conv->buyer_id,
                    'reviewed_user_id' => $conv->seller_id,
                    'listing_id' => $conv->listing_id,
                    'rating' => rand(3, 5), // Mostly positive
                    'review_text' => fake()->realText(150),
                    'created_at' => $now,
                ];
            }
            
            // Add some seller reviewing buyer
            if (rand(1, 100) > 70) {
                $key2 = $conv->seller_id . '-' . $conv->listing_id;
                if (!isset($uniquePairs[$key2])) {
                    $uniquePairs[$key2] = true;
                    $reviews[] = [
                        'reviewer_id' => $conv->seller_id,
                        'reviewed_user_id' => $conv->buyer_id,
                        'listing_id' => $conv->listing_id,
                        'rating' => rand(4, 5),
                        'review_text' => fake()->realText(100),
                        'created_at' => $now,
                    ];
                }
            }
        }

        $chunks = array_chunk($reviews, 500);
        foreach ($chunks as $chunk) {
            DB::table('reviews')->insert($chunk);
        }
    }
}
