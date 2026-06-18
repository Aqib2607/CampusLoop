<?php

namespace Database\Factories;

use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReportFactory extends Factory
{
    protected $model = Report::class;

    public function definition(): array
    {
        return [
            'reporter_id' => User::factory(),
            'report_type' => fake()->randomElement(['listing', 'profile', 'message']),
            'target_id' => fake()->numberBetween(1, 1000), // Updated in seeder
            'reason' => fake()->randomElement(['spam', 'scam', 'inappropriate', 'other']),
            'description' => fake()->realText(100),
            'status' => fake()->randomElement(['open', 'under_review', 'resolved', 'dismissed']),
            'assigned_to' => null, // Updated in seeder
        ];
    }
}
