<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Listing;

class ModerationSeeder extends Seeder
{
    public function run(): void
    {
        $moderators = User::role('moderator')->pluck('id')->toArray();
        $users = User::pluck('id')->toArray();
        $listings = Listing::pluck('id')->toArray();

        if (empty($moderators)) return;

        $actions = [];
        $actionTypes = ['warning', 'hide', 'suspend', 'ban', 'approve', 'reject'];

        for ($i = 0; $i < 300; $i++) {
            $type = rand(0, 1) ? 'user' : 'listing';
            $targetId = $type === 'listing' && !empty($listings) ? $listings[array_rand($listings)] : $users[array_rand($users)];

            $actions[] = [
                'moderator_id' => $moderators[array_rand($moderators)],
                'target_type' => $type,
                'target_id' => $targetId,
                'action_type' => $actionTypes[array_rand($actionTypes)],
                'notes' => fake()->realText(50),
                'created_at' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d H:i:s'),
            ];
        }

        DB::table('moderation_actions')->insert($actions);
    }
}
