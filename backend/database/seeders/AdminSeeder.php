<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->first();

        $admin = User::firstOrCreate(
            ['email' => 'admin@campusloop.com'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'phone' => '+8801700000000',
                'university' => 'System',
                'department' => 'Administration',
                'is_verified' => true,
                'status' => 'active',
                'avatar' => 'https://ui-avatars.com/api/?name=Admin&background=random',
                'bio' => 'Super Administrator of CampusLoop.',
            ]
        );

        if ($adminRole) {
            $admin->assignRole($adminRole);
        }
    }
}
