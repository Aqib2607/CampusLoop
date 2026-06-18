<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AiModerationLog extends Model
{
    use HasFactory;
    protected $fillable = [
        'listing_id', 'provider_id', 'api_key_id', 'risk_score',
        'risk_level', 'result', 'response_data', 'summary',
    ];

    protected function casts(): array
    {
        return [
            'risk_score'    => 'decimal:2',
            'response_data' => 'array',
        ];
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(AiProvider::class, 'provider_id');
    }

    public function apiKey(): BelongsTo
    {
        return $this->belongsTo(ApiKey::class);
    }
}
