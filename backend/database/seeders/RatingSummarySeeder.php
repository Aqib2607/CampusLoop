<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RatingSummarySeeder extends Seeder
{
    public function run(): void
    {
        $now = now();
        $summaries = DB::table('reviews')
            ->select('reviewed_user_id')
            ->selectRaw('ROUND(AVG(rating), 2) as average_rating')
            ->selectRaw('COUNT(*) as review_count')
            ->selectRaw('ROUND(100 * SUM(CASE WHEN rating >= 4 THEN 1 ELSE 0 END) / COUNT(*), 2) as positive_percentage')
            ->groupBy('reviewed_user_id')
            ->get()
            ->map(fn ($review) => [
                'user_id' => $review->reviewed_user_id,
                'average_rating' => $review->average_rating,
                'review_count' => $review->review_count,
                'positive_percentage' => $review->positive_percentage,
                'created_at' => $now,
                'updated_at' => $now,
            ])
            ->all();

        foreach (array_chunk($summaries, 500) as $chunk) {
            DB::table('rating_summaries')->insert($chunk);
        }
    }
}
