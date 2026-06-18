<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserSetting;

class UserSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::pluck('id')->toArray();

        $settings = [];
        $now = now();

        foreach ($users as $userId) {
            $settings[] = [
                'user_id' => $userId,
                'default_expiry_days' => 30,
                'email_notifications' => true,
                'push_notifications' => true,
                'privacy_mode' => false,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // Bulk insert to save time
        $chunks = array_chunk($settings, 100);
        foreach ($chunks as $chunk) {
            UserSetting::insert($chunk);
        }
    }
}
