<?php

namespace App\Services\AI\Providers;

use App\Models\ApiKey;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

class GeminiProvider extends AbstractAIProvider
{
    private readonly Client $http;
    private readonly string $apiKey;

    public function __construct(ApiKey $apiKey)
    {
        parent::__construct($apiKey);
        $this->apiKey = $apiKey->decryptKey();
        $this->http   = new Client(['timeout' => 30]);
    }

    public function getProviderName(): string
    {
        return 'gemini';
    }

    public function moderate(string $content): array
    {
        $url    = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$this->apiKey}";
        $prompt = $this->buildModerationPrompt($content);

        $response = $this->http->post($url, [
            'json' => [
                'contents' => [
                    ['parts' => [['text' => $prompt]]],
                ],
                'generationConfig' => [
                    'temperature'     => 0.1,
                    'maxOutputTokens' => 300,
                ],
            ],
        ]);

        $body   = json_decode($response->getBody()->getContents(), true);
        $text   = $body['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
        $parsed = json_decode(trim($text), true) ?? [];

        $riskScore = (float) ($parsed['risk_score'] ?? 0.1);
        $riskLevel = $this->scoreToLevel($riskScore);

        return $this->buildModerationResult(
            $riskScore,
            $riskLevel,
            $parsed['result'] ?? 'clean',
            $parsed['summary'] ?? 'No issues detected.',
            $body
        );
    }

    public function isRateLimitError(\Throwable $e): bool
    {
        if ($e instanceof ClientException) {
            return in_array($e->getResponse()->getStatusCode(), [429, 503, 500]);
        }
        return false;
    }

    private function buildModerationPrompt(string $content): string
    {
        return <<<PROMPT
Analyze this campus marketplace listing for spam, scam, toxic language, or prohibited items. Respond ONLY in valid JSON:
{
  "risk_score": 0.0-1.0,
  "result": "clean|spam|scam|toxic|duplicate|prohibited",
  "summary": "Brief one sentence explanation"
}

Listing content:
{$content}
PROMPT;
    }
}
