<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AiProvider extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider_name', 'display_name', 'status', 'description', 'config',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'boolean',
            'config' => 'array',
        ];
    }

    public function apiKeys(): HasMany
    {
        return $this->hasMany(ApiKey::class, 'provider_id');
    }

    public function activeKeys(): HasMany
    {
        return $this->hasMany(ApiKey::class, 'provider_id')
            ->where('status', true)
            ->whereNull('deleted_at')
            ->orderBy('priority');
    }

    public function aiModerationLogs(): HasMany
    {
        return $this->hasMany(AiModerationLog::class, 'provider_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }
}
