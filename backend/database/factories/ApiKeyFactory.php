<?php

namespace Database\Factories;

use App\Models\ApiKey;
use App\Models\AiProvider;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Crypt;

class ApiKeyFactory extends Factory
{
    protected $model = ApiKey::class;

    public function definition(): array
    {
        return [
            'provider_id' => AiProvider::factory(),
            'key_name' => 'Key ' . fake()->word(),
            'encrypted_key' => Crypt::encryptString('sk-' . fake()->regexify('[A-Za-z0-9]{32}')),
            'priority' => fake()->numberBetween(1, 10),
            'status' => true,
            'requests_today' => fake()->numberBetween(0, 1000),
            'success_count' => fake()->numberBetween(100, 5000),
            'failure_count' => fake()->numberBetween(0, 50),
            'last_used_at' => fake()->dateTimeBetween('-1 day', 'now'),
            'created_by' => User::factory(),
        ];
    }
}
