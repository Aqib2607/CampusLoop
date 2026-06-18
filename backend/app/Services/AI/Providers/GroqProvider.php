<?php

namespace App\Services\AI\Providers;

use App\Models\ApiKey;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

class GroqProvider extends AbstractAIProvider
{
    private readonly Client $http;

    public function __construct(ApiKey $apiKey)
    {
        parent::__construct($apiKey);
        $this->http = new Client([
            'base_uri' => 'https://api.groq.com/openai/v1/',
            'timeout'  => 30,
            'headers'  => [
                'Authorization' => 'Bearer ' . $apiKey->decryptKey(),
                'Content-Type'  => 'application/json',
            ],
        ]);
    }

    public function getProviderName(): string
    {
        return 'groq';
    }

    public function moderate(string $content): array
    {
        $prompt = $this->buildModerationPrompt($content);

        $response = $this->http->post('chat/completions', [
            'json' => [
                'model'       => 'llama3-8b-8192',
                'messages'    => [
                    ['role' => 'system', 'content' => 'You are a content moderation AI. Respond only in valid JSON.'],
                    ['role' => 'user',   'content' => $prompt],
                ],
                'temperature' => 0.1,
                'max_tokens'  => 300,
            ],
        ]);

        $body    = json_decode($response->getBody()->getContents(), true);
        $text    = $body['choices'][0]['message']['content'] ?? '{}';
        $parsed  = json_decode($text, true) ?? [];

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
            return in_array($e->getResponse()->getStatusCode(), [429, 503]);
        }
        return false;
    }

    private function buildModerationPrompt(string $content): string
    {
        return <<<PROMPT
Analyze the following marketplace listing content for: spam, scam, toxic language, prohibited items, or duplicates.

Content:
{$content}

Respond in strict JSON only:
{
  "risk_score": 0.0-1.0,
  "result": "clean|spam|scam|toxic|duplicate|prohibited",
  "summary": "Brief explanation"
}
PROMPT;
    }
}
