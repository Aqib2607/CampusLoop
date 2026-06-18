<?php

return [
    /*
    |--------------------------------------------------------------------------
    | AI Provider Configuration
    |--------------------------------------------------------------------------
    |
    | Default provider used when no specific provider is specified.
    | Keys are managed through the API Keys admin panel and stored encrypted.
    |
    */

    'default_provider' => env('AI_PROVIDER', 'groq'),

    'providers' => [
        'groq' => [
            'name'     => 'Groq',
            'base_url' => 'https://api.groq.com/openai/v1/',
            'model'    => 'llama3-8b-8192',
        ],
        'gemini' => [
            'name'     => 'Google Gemini',
            'base_url' => 'https://generativelanguage.googleapis.com/v1beta/',
            'model'    => 'gemini-1.5-flash',
        ],
        'openai' => [
            'name'     => 'OpenAI',
            'base_url' => 'https://api.openai.com/v1/',
            'model'    => 'gpt-4o-mini',
        ],
        'claude' => [
            'name'     => 'Anthropic Claude',
            'base_url' => 'https://api.anthropic.com/v1/',
            'model'    => 'claude-3-haiku-20240307',
        ],
    ],

    /*
    | Key rotation settings
    */
    'rotation' => [
        'max_retries'              => 5,
        'rate_limit_cooldown_mins' => 60,
    ],

    /*
    | Risk score thresholds
    */
    'risk_thresholds' => [
        'low'      => 0.35,
        'medium'   => 0.60,
        'high'     => 0.80,
        'critical' => 1.00,
    ],
];
