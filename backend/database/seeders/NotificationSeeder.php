<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::pluck('id')->toArray();
        if (empty($users)) return;

        $notifications = [];
        $types = ['message', 'listing_approved', 'listing_rejected', 'report_update', 'system'];
        $statuses = ['unread', 'unread', 'read', 'archived'];

        // 15000 notifications
        for ($i = 0; $i < 15000; $i++) {
            $notifications[] = [
                'user_id' => $users[array_rand($users)],
                'type' => $types[array_rand($types)],
                'title' => fake()->catchPhrase(),
                'message' => fake()->realText(100),
                'status' => $statuses[array_rand($statuses)],
                'created_at' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d H:i:s'),
            ];

            if (count($notifications) >= 1000) {
                DB::table('notifications')->insert($notifications);
                $notifications = [];
            }
        }

        if (count($notifications) > 0) {
            DB::table('notifications')->insert($notifications);
        }
    }
}
