<?php

namespace App\Services\AI;

use App\Models\AiProvider;
use RuntimeException;

class ProviderManagerService
{
    public function __construct(
        private readonly ApiKeyRotationService $rotationService
    ) {}

    /**
     * Call the specified provider (or the default active one) with a moderation task.
     *
     * @param  callable  $task  Callable that receives AbstractAIProvider and returns array
     * @param  string|null  $providerName  Optional override; defaults to env AI_PROVIDER
     */
    public function call(callable $task, ?string $providerName = null): array
    {
        $providerName = $providerName ?? config('ai.default_provider', 'groq');

        $provider = AiProvider::where('provider_name', strtolower($providerName))
            ->where('status', true)
            ->first();

        if (! $provider) {
            // Try any active provider as fallback
            $provider = AiProvider::where('status', true)->first();
        }

        if (! $provider) {
            throw new RuntimeException('No active AI providers configured.');
        }

        return $this->rotationService->executeWithRotation($provider, $task);
    }

    /**
     * Call a specific provider by ID.
     */
    public function callProvider(int $providerId, callable $task): array
    {
        $provider = AiProvider::findOrFail($providerId);

        return $this->rotationService->executeWithRotation($provider, $task);
    }
}
