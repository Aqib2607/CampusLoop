<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AuditLogSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::pluck('id')->toArray();
        if (empty($users)) return;

        $logs = [];
        $actions = ['Login', 'Logout', 'Create', 'Update', 'Delete', 'Suspend', 'API Key Changes', 'Moderation Actions'];
        $tables = ['users', 'listings', 'messages', 'reports', 'categories', 'api_keys'];

        // 25,000 audit logs
        for ($i = 0; $i < 25000; $i++) {
            $logs[] = [
                'user_id' => $users[array_rand($users)],
                'action_type' => $actions[array_rand($actions)],
                'table_name' => $tables[array_rand($tables)],
                'record_id' => rand(1, 1000),
                'old_values' => json_encode(['status' => 'old']),
                'new_values' => json_encode(['status' => 'new']),
                'ip_address' => fake()->ipv4(),
                'user_agent' => fake()->userAgent(),
                'created_at' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d H:i:s'),
            ];

            if (count($logs) >= 1000) {
                DB::table('audit_logs')->insert($logs);
                $logs = [];
            }
        }
        
        if (count($logs) > 0) DB::table('audit_logs')->insert($logs);
    }
}
