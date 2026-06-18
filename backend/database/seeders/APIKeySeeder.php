<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ApiKey;
use App\Models\AiProvider;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class APIKeySeeder extends Seeder
{
    public function run(): void
    {
        $providers = AiProvider::all();
        $admin = User::role('admin')->first() ?? User::first();
        if ($providers->isEmpty() || !$admin) return;

        foreach ($providers as $provider) {
            ApiKey::factory()->count(3)->create([
                'provider_id' => $provider->id,
                'created_by' => $admin->id
            ]);
        }

        // Generate ApiKeyLogs
        $keys = ApiKey::pluck('id')->toArray();
        if (empty($keys)) return;

        $logs = [];
        $types = ['chat/completions', 'moderation', 'embeddings'];
        $statuses = ['success', 'success', 'success', 'rate_limited', 'failure', 'timeout'];

        for ($i = 0; $i < 2000; $i++) {
            $logs[] = [
                'api_key_id' => $keys[array_rand($keys)],
                'request_type' => $types[array_rand($types)],
                'response_status' => $statuses[array_rand($statuses)],
                'error_message' => null,
                'created_at' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d H:i:s'),
            ];

            if (count($logs) >= 1000) {
                DB::table('api_key_logs')->insert($logs);
                $logs = [];
            }
        }
        if (count($logs) > 0) DB::table('api_key_logs')->insert($logs);
    }
}
