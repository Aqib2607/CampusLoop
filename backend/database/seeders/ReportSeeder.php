<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Listing;

class ReportSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::pluck('id')->toArray();
        $moderators = User::role('moderator')->pluck('id')->toArray();
        $listings = Listing::pluck('id')->toArray();

        if (empty($users)) return;

        $reports = [];
        $now = now();
        $types = ['listing', 'profile', 'message'];
        $statuses = ['open', 'under_review', 'resolved', 'dismissed'];
        $reasons = ['spam', 'scam', 'inappropriate', 'other'];

        // 400 reports
        for ($i = 0; $i < 400; $i++) {
            $type = $types[array_rand($types)];
            $targetId = $type === 'listing' && !empty($listings) ? $listings[array_rand($listings)] : $users[array_rand($users)];
            $status = $statuses[array_rand($statuses)];
            $assignedTo = in_array($status, ['under_review', 'resolved', 'dismissed']) && !empty($moderators) ? $moderators[array_rand($moderators)] : null;

            $reports[] = [
                'reporter_id' => $users[array_rand($users)],
                'report_type' => $type,
                'target_id' => $targetId,
                'reason' => $reasons[array_rand($reasons)],
                'description' => fake()->realText(100),
                'status' => $status,
                'assigned_to' => $assignedTo,
                'created_at' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d H:i:s'),
            ];
        }

        DB::table('reports')->insert($reports);
    }
}
