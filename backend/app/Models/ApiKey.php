<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Crypt;

class ApiKey extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'provider_id', 'key_name', 'encrypted_key', 'priority', 'status',
        'requests_today', 'success_count', 'failure_count', 'last_used_at',
        'disabled_until', 'created_by',
    ];

    protected $hidden = ['encrypted_key'];

    protected function casts(): array
    {
        return [
            'status'        => 'boolean',
            'last_used_at'  => 'datetime',
            'disabled_until' => 'datetime',
        ];
    }

    // ─── Key Encryption / Decryption ─────────────────────────────────────────

    public function setRawKeyAttribute(string $plainKey): void
    {
        $this->encrypted_key = Crypt::encryptString($plainKey);
    }

    public function decryptKey(): string
    {
        return Crypt::decryptString($this->encrypted_key);
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function provider(): BelongsTo
    {
        return $this->belongsTo(AiProvider::class, 'provider_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(ApiKeyLog::class);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    public function isAvailable(): bool
    {
        if (! $this->status) {
            return false;
        }
        if ($this->disabled_until && $this->disabled_until->isFuture()) {
            return false;
        }

        return true;
    }

    public function markRateLimited(int $cooldownMinutes = 60): void
    {
        $this->update([
            'disabled_until' => now()->addMinutes($cooldownMinutes),
            'failure_count'  => $this->failure_count + 1,
        ]);
    }

    public function recordSuccess(): void
    {
        $this->increment('success_count');
        $this->increment('requests_today');
        $this->update(['last_used_at' => now()]);
    }

    public function recordFailure(): void
    {
        $this->increment('failure_count');
        $this->increment('requests_today');
    }

    public function scopeActive($query)
    {
        return $query->where('status', true)
            ->where(function ($q) {
                $q->whereNull('disabled_until')
                    ->orWhere('disabled_until', '<', now());
            })
            ->orderBy('priority');
    }
}
