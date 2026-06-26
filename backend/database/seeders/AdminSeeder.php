<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;
use Spatie\Permission\Models\Role;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::query()->where('name', 'admin')->first();
        $admin = User::query()->role('staff')->first();

        if (! $admin || ! $adminRole) {
            throw new RuntimeException('AdminSeeder requires the staff and admin roles to be seeded first.');
        }

        $admin->update([
            'name' => 'CampusLoop Administrator',
            'email' => 'admin@campusloop.com',
            'password' => Hash::make('password'),
            'department' => 'Marketplace Administration',
            'bio' => 'University staff member responsible for CampusLoop marketplace administration.',
        ]);
        $admin->assignRole($adminRole);
    }
}
