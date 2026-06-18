<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $teacherRole = Role::where('name', 'teacher')->first();
        $staffRole = Role::where('name', 'staff')->first();
        $studentRole = Role::where('name', 'student')->first();

        $teachers = User::factory()->count(50)->create();
        if ($teacherRole) {
            foreach ($teachers as $user) {
                $user->assignRole($teacherRole);
            }
        }

        $staffs = User::factory()->count(50)->create();
        if ($staffRole) {
            foreach ($staffs as $user) {
                $user->assignRole($staffRole);
            }
        }

        // Use chunking to insert 500 students efficiently if needed, but factories are okay for 500.
        // It takes about 2-3 seconds for 500.
        $students = User::factory()->count(500)->create();
        if ($studentRole) {
            foreach ($students as $user) {
                $user->assignRole($studentRole);
            }
        }
    }
}
