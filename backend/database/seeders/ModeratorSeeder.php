<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;
use Spatie\Permission\Models\Role;

class ModeratorSeeder extends Seeder
{
    public function run(): void
    {
        $moderatorRole = Role::query()->where('name', 'moderator')->first();
        $moderators = User::query()
            ->role('staff')
            ->whereDoesntHave('roles', fn ($query) => $query->where('name', 'admin'))
            ->limit(5)
            ->get();

        if (! $moderatorRole || $moderators->count() !== 5) {
            throw new RuntimeException('ModeratorSeeder requires five non-admin staff accounts.');
        }

        foreach ($moderators as $index => $moderator) {
            $moderator->update([
                'name' => 'Campus Moderator '.($index + 1),
                'department' => 'Student Affairs',
                'bio' => 'University staff member helping keep CampusLoop listings safe and useful.',
            ]);
            $moderator->assignRole($moderatorRole);
        }
    }
}
