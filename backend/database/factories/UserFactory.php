<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        $universities = [
            'Dhaka University', 'BRAC University', 'North South University',
            'BUET', 'IUB', 'AIUB', 'East West University', 'Ahsanullah University of Science and Technology',
            'Daffodil International University', 'United International University'
        ];
        $departments = [
            'Computer Science and Engineering', 'Business Administration', 'Electrical Engineering',
            'Architecture', 'English', 'Economics', 'Law', 'Civil Engineering', 'Mechanical Engineering'
        ];

        return [
            'name' => fake()->name('bn_BD'), // Use Bengali names for realism if supported, or regular names
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'phone' => '+8801' . fake()->numberBetween(3, 9) . fake()->numerify('########'),
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode(fake()->name()) . '&background=random',
            'bio' => fake()->realText(100),
            'university' => fake()->randomElement($universities),
            'department' => fake()->randomElement($departments),
            'is_verified' => true,
            'status' => 'active',
            'last_login_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
