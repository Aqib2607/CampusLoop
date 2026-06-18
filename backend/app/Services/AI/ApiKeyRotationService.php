<?php

namespace App\Services\AI;

use App\Models\ApiKey;
use App\Models\ApiKeyLog;
use App\Services\AI\Providers\AbstractAIProvider;
use App\Services\AI\Providers\ClaudeProvider;
use App\Services\AI\Providers\GeminiProvider;
use App\Services\AI\Providers\GroqProvider;
use App\Services\AI\Providers\OpenAIProvider;
use RuntimeException;

class ApiKeyRotationService
{
    /** Number of times to retry across all available keys before giving up. */
    private const MAX_RETRIES = 5;

    /** Cooldown applied to a key when rate-limited (minutes). */
    private const RATE_LIMIT_COOLDOWN_MINUTES = 60;

    /**
     * Execute a callable with automatic key rotation on failure.
     *
     * @param  \App\Models\AiProvider  $provider
     * @param  callable(AbstractAIProvider): array  $callable
     * @return array  Moderation result
     */
    public function executeWithRotation(\App\Models\AiProvider $provider, callable $callable): array
    {
        $keys    = $provider->activeKeys()->get();
        $attempt = 0;

        if ($keys->isEmpty()) {
            throw new RuntimeException("No active API keys available for provider: {$provider->provider_name}");
        }

        $lastException = null;

        foreach ($keys as $key) {
            if ($attempt >= self::MAX_RETRIES) {
                break;
            }

            $attempt++;

            try {
                $driver = $this->resolveDriver($provider->provider_name, $key);
                $start  = microtime(true);

                $result = $callable($driver);

                $elapsed = (int) ((microtime(true) - $start) * 1000);

                $this->logSuccess($key, $elapsed);
                $key->recordSuccess();

                return $result;

            } catch (\Throwable $e) {
                $lastException = $e;

                // Check if it's a rate-limit / quota error
                $driver = $this->resolveDriver($provider->provider_name, $key);
                if ($driver->isRateLimitError($e)) {
                    // Temporarily disable this key and try the next one
                    $key->markRateLimited(self::RATE_LIMIT_COOLDOWN_MINUTES);
                    $this->logFailure($key, 'rate_limited', $e->getMessage());
                } else {
                    $key->recordFailure();
                    $this->logFailure($key, 'failure', $e->getMessage());
                }

                // Continue to next key
                continue;
            }
        }

        throw new RuntimeException(
            "All API keys exhausted for provider [{$provider->provider_name}]. Last error: " . ($lastException?->getMessage() ?? 'unknown')
        );
    }

    private function resolveDriver(string $providerName, ApiKey $key): AbstractAIProvider
    {
        return match (strtolower($providerName)) {
            'groq'   => new GroqProvider($key),
            'gemini' => new GeminiProvider($key),
            'openai' => new OpenAIProvider($key),
            'claude' => new ClaudeProvider($key),
            default  => throw new RuntimeException("Unsupported AI provider: {$providerName}"),
        };
    }

    private function logSuccess(ApiKey $key, int $responseTimeMs): void
    {
        ApiKeyLog::create([
            'api_key_id'       => $key->id,
            'response_status'  => 'success',
            'response_time_ms' => $responseTimeMs,
        ]);
    }

    private function logFailure(ApiKey $key, string $status, string $errorMessage): void
    {
        ApiKeyLog::create([
            'api_key_id'      => $key->id,
            'response_status' => $status,
            'error_message'   => substr($errorMessage, 0, 1000),
        ]);
    }
}
