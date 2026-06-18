<?php

namespace App\Services\AI\Providers;

use App\Models\ApiKey;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

class ClaudeProvider extends AbstractAIProvider
{
    private readonly Client $http;

    public function __construct(ApiKey $apiKey)
    {
        parent::__construct($apiKey);
        $this->http = new Client([
            'base_uri' => 'https://api.anthropic.com/v1/',
            'timeout'  => 30,
            'headers'  => [
                'x-api-key'         => $apiKey->decryptKey(),
                'anthropic-version' => '2023-06-01',
                'Content-Type'      => 'application/json',
            ],
        ]);
    }

    public function getProviderName(): string
    {
        return 'claude';
    }

    public function moderate(string $content): array
    {
        $response = $this->http->post('messages', [
            'json' => [
                'model'      => 'claude-3-haiku-20240307',
                'max_tokens' => 300,
                'system'     => 'You are a content moderator. Respond only in valid JSON.',
                'messages'   => [
                    ['role' => 'user', 'content' => $this->buildModerationPrompt($content)],
                ],
            ],
        ]);

        $body      = json_decode($response->getBody()->getContents(), true);
        $text      = $body['content'][0]['text'] ?? '{}';
        $parsed    = json_decode($text, true) ?? [];
        $riskScore = (float) ($parsed['risk_score'] ?? 0.1);

        return $this->buildModerationResult(
            $riskScore,
            $this->scoreToLevel($riskScore),
            $parsed['result'] ?? 'clean',
            $parsed['summary'] ?? 'No issues detected.',
            $body
        );
    }

    public function isRateLimitError(\Throwable $e): bool
    {
        if ($e instanceof ClientException) {
            return in_array($e->getResponse()->getStatusCode(), [429, 529]);
        }
        return false;
    }

    private function buildModerationPrompt(string $content): string
    {
        return <<<PROMPT
Analyze this marketplace listing for spam, scam, or harmful content. Return ONLY valid JSON:
{
  "risk_score": 0.0-1.0,
  "result": "clean|spam|scam|toxic|duplicate|prohibited",
  "summary": "One sentence explanation"
}

Content: {$content}
PROMPT;
    }
}
