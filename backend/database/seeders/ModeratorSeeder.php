<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class ModeratorSeeder extends Seeder
{
    public function run(): void
    {
        $moderatorRole = Role::where('name', 'moderator')->first();

        $moderators = User::factory()->count(5)->create([
            'status' => 'active'
        ]);

        if ($moderatorRole) {
            foreach ($moderators as $moderator) {
                $moderator->assignRole($moderatorRole);
            }
        }
    }
}
