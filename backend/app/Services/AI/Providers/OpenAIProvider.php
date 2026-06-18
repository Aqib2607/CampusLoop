<?php

namespace App\Services\AI\Providers;

use App\Models\ApiKey;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

class OpenAIProvider extends AbstractAIProvider
{
    private readonly Client $http;

    public function __construct(ApiKey $apiKey)
    {
        parent::__construct($apiKey);
        $this->http = new Client([
            'base_uri' => 'https://api.openai.com/v1/',
            'timeout'  => 30,
            'headers'  => [
                'Authorization' => 'Bearer ' . $apiKey->decryptKey(),
                'Content-Type'  => 'application/json',
            ],
        ]);
    }

    public function getProviderName(): string
    {
        return 'openai';
    }

    public function moderate(string $content): array
    {
        $response = $this->http->post('chat/completions', [
            'json' => [
                'model'       => 'gpt-4o-mini',
                'messages'    => [
                    [
                        'role'    => 'system',
                        'content' => 'You are a campus marketplace content moderator. Return only valid JSON.',
                    ],
                    [
                        'role'    => 'user',
                        'content' => $this->buildModerationPrompt($content),
                    ],
                ],
                'temperature'    => 0.1,
                'max_tokens'     => 300,
                'response_format' => ['type' => 'json_object'],
            ],
        ]);

        $body      = json_decode($response->getBody()->getContents(), true);
        $parsed    = json_decode($body['choices'][0]['message']['content'] ?? '{}', true) ?? [];
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
            return in_array($e->getResponse()->getStatusCode(), [429, 503]);
        }
        return false;
    }

    private function buildModerationPrompt(string $content): string
    {
        return <<<PROMPT
Analyze this campus marketplace listing. Return JSON:
{
  "risk_score": 0.0-1.0,
  "result": "clean|spam|scam|toxic|duplicate|prohibited",
  "summary": "Brief explanation"
}

Content: {$content}
PROMPT;
    }
}
