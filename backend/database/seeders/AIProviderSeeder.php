<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AiProvider;

class AIProviderSeeder extends Seeder
{
    public function run(): void
    {
        $providers = ['OpenAI', 'Gemini', 'Groq', 'Claude'];
        foreach ($providers as $provider) {
            AiProvider::factory()->create([
                'provider_name' => strtolower($provider),
                'display_name' => $provider,
                'description' => "Integration for $provider",
            ]);
        }
    }
}
