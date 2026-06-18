<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\AiProvider;
use App\Models\Listing;

class AIModerationSeeder extends Seeder
{
    public function run(): void
    {
        $providers = AiProvider::pluck('id')->toArray();
        $listings = Listing::pluck('id')->toArray();

        if (empty($providers) || empty($listings)) return;

        $logs = [];
        $results = ['clean', 'clean', 'clean', 'spam', 'scam', 'duplicate'];

        // Let's create 1000 moderation logs
        for ($i = 0; $i < 1000; $i++) {
            $result = $results[array_rand($results)];
            $score = $result === 'clean' ? rand(0, 30) / 100 : rand(70, 99) / 100;

            $logs[] = [
                'listing_id' => $listings[array_rand($listings)],
                'provider_id' => $providers[array_rand($providers)],
                'risk_score' => $score,
                'result' => $result,
                'response_data' => json_encode(['confidence' => $score * 100, 'flagged' => $result !== 'clean']),
                'created_at' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d H:i:s'),
            ];

            if (count($logs) >= 500) {
                DB::table('ai_moderation_logs')->insert($logs);
                $logs = [];
            }
        }
        if (count($logs) > 0) DB::table('ai_moderation_logs')->insert($logs);
    }
}
