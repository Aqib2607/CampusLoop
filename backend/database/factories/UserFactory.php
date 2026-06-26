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
            'University of Dhaka' => 'du.edu.bd',
            'BRAC University' => 'bracu.edu',
            'North South University' => 'northsouth.edu',
            'Bangladesh University of Engineering and Technology' => 'buet.edu',
            'Independent University, Bangladesh' => 'iub.edu',
            'American International University-Bangladesh' => 'aiub.edu',
            'East West University' => 'ewubd.edu',
            'Ahsanullah University of Science and Technology' => 'aust.edu',
            'Daffodil International University' => 'diu.edu',
            'United International University' => 'uiu.edu',
        ];
        $departments = [
            'Computer Science and Engineering', 'Business Administration', 'Electrical Engineering',
            'Architecture', 'English', 'Economics', 'Law', 'Civil Engineering', 'Mechanical Engineering'
        ];

        $university = fake()->randomKey($universities);
        $domain = $universities[$university];
        $name = fake()->name();

        return [
            'name' => $name,
            'email' => fake()->unique()->userName() . '@' . $domain,
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'phone' => '+8801' . fake()->numberBetween(3, 9) . fake()->numerify('########'),
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($name) . '&background=random',
            'bio' => fake()->realText(100),
            'university' => $university,
            'department' => fake()->randomElement($departments),
            'is_verified' => true,
            'status' => 'active',
            'last_login_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }

    public function student(): static
    {
        return $this->state(fn (): array => [
            'student_id' => fake()->unique()->numerify('20########'),
            'year_of_study' => fake()->numberBetween(1, 5),
            'bio' => fake()->randomElement([
                'Undergraduate student clearing out useful course materials and dorm essentials.',
                'Campus resident interested in affordable books, electronics, and study gear.',
                'Student seller who prefers safe meetups around the library or student centre.',
            ]),
        ]);
    }

    public function teacher(): static
    {
        return $this->state(fn (): array => [
            'student_id' => null,
            'year_of_study' => null,
            'bio' => 'University faculty member sharing academic resources with the campus community.',
        ]);
    }

    public function staff(): static
    {
        return $this->state(fn (): array => [
            'student_id' => null,
            'year_of_study' => null,
            'bio' => 'University staff member and verified participant in the campus marketplace.',
        ]);
    }
}
