<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class RatingSummarySeeder extends Seeder
{
    public function run(): void
    {
        $users = User::pluck('id')->toArray();
        if (empty($users)) return;

        $summaries = [];

        foreach ($users as $userId) {
            // Check if they have reviews (simplified for speed)
            // Just generating random summaries for all users to populate the DB
            $count = rand(0, 50);
            if ($count > 0) {
                $summaries[] = [
                    'user_id' => $userId,
                    'average_rating' => rand(30, 50) / 10,
                    'review_count' => $count,
                    'positive_percentage' => rand(70, 100),
                ];
            }
        }

        $chunks = array_chunk($summaries, 500);
        foreach ($chunks as $chunk) {
            DB::table('rating_summaries')->insert($chunk);
        }
    }
}
