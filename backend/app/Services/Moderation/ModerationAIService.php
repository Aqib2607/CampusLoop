<?php

namespace App\Services\Moderation;

use App\Models\AiModerationLog;
use App\Models\Listing;
use App\Services\AI\ProviderManagerService;

class ModerationAIService
{
    public function __construct(
        private readonly ProviderManagerService $providerManager
    ) {}

    /**
     * Analyze a listing submission and store the moderation log.
     */
    public function analyzeListing(Listing $listing): AiModerationLog
    {
        $content = "Title: {$listing->title}\n\nDescription: {$listing->description}\n\nPrice: {$listing->price}";

        $result = $this->providerManager->call(
            fn ($provider) => $provider->moderate($content)
        );

        // Resolve provider model
        $provider = \App\Models\AiProvider::where('provider_name', $result['provider'])->first();

        return AiModerationLog::create([
            'listing_id'    => $listing->id,
            'provider_id'   => $provider?->id ?? 1,
            'risk_score'    => $result['risk_score'],
            'risk_level'    => $result['risk_level'],
            'result'        => $result['result'],
            'response_data' => $result['response_data'] ?? [],
            'summary'       => $result['summary'],
        ]);
    }

    /**
     * Get the risk level label for a listing.
     */
    public function getRiskLevel(Listing $listing): string
    {
        $log = $listing->latestAiModerationLog;
        return $log?->risk_level ?? 'unknown';
    }

    /**
     * Determine if a listing needs human review based on risk score.
     */
    public function needsHumanReview(Listing $listing): bool
    {
        $log = $listing->latestAiModerationLog;
        if (! $log) {
            return true;
        }
        return in_array($log->risk_level, ['high', 'critical']);
    }
}
