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

        $teachers = User::factory()->teacher()->count(50)->create();
        if ($teacherRole) {
            foreach ($teachers as $user) {
                $user->assignRole($teacherRole);
            }
        }

        $staffs = User::factory()->staff()->count(50)->create();
        if ($staffRole) {
            foreach ($staffs as $user) {
                $user->assignRole($staffRole);
            }
        }

        $students = User::factory()->student()->count(500)->create();
        if ($studentRole) {
            foreach ($students as $user) {
                $user->assignRole($studentRole);
            }
        }
    }
}
