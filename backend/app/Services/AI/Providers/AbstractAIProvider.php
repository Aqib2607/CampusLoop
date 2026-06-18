<?php

namespace App\Services\AI\Providers;

use App\Models\ApiKey;

abstract class AbstractAIProvider
{
    protected ApiKey $apiKey;

    public function __construct(ApiKey $apiKey)
    {
        $this->apiKey = $apiKey;
    }

    public function getApiKey(): ApiKey
    {
        return $this->apiKey;
    }

    /**
     * Analyze content and return a moderation result.
     */
    abstract public function moderate(string $content): array;

    /**
     * Check if an exception is a rate-limit / quota error.
     */
    abstract public function isRateLimitError(\Throwable $e): bool;

    /**
     * Get the provider name identifier.
     */
    abstract public function getProviderName(): string;

    /**
     * Build a standard moderation result payload.
     */
    protected function buildModerationResult(
        float $riskScore,
        string $riskLevel,
        string $result,
        string $summary,
        array $rawResponse = []
    ): array {
        return [
            'risk_score'    => $riskScore,
            'risk_level'    => $riskLevel,
            'result'        => $result,
            'summary'       => $summary,
            'response_data' => $rawResponse,
            'provider'      => $this->getProviderName(),
        ];
    }

    /**
     * Derive risk level from a 0.0–1.0 risk score.
     */
    protected function scoreToLevel(float $score): string
    {
        return match (true) {
            $score >= 0.80 => 'critical',
            $score >= 0.60 => 'high',
            $score >= 0.35 => 'medium',
            default        => 'low',
        };
    }
}
