<?php

namespace Database\Factories;

use App\Models\AiProvider;
use Illuminate\Database\Eloquent\Factories\Factory;

class AiProviderFactory extends Factory
{
    protected $model = AiProvider::class;

    public function definition(): array
    {
        $providerName = fake()->unique()->randomElement(['OpenAI', 'Gemini', 'Groq', 'Claude']);
        return [
            'provider_name' => strtolower($providerName),
            'display_name' => $providerName,
            'description' => "Integration for $providerName",
            'status' => true,
        ];
    }
}
