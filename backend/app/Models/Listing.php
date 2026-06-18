<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Listing extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'user_id', 'category_id', 'title', 'description', 'price',
        'condition', 'negotiable', 'status', 'rejection_reason',
        'expiry_days', 'expiry_date', 'sold_at', 'published_at',
        'view_count', 'location',
    ];

    protected function casts(): array
    {
        return [
            'price'        => 'decimal:2',
            'negotiable'   => 'boolean',
            'expiry_date'  => 'datetime',
            'sold_at'      => 'datetime',
            'published_at' => 'datetime',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ListingImage::class)->orderBy('display_order');
    }

    public function views(): HasMany
    {
        return $this->hasMany(ListingView::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class, 'target_id')
            ->where('report_type', 'listing');
    }

    public function aiModerationLogs(): HasMany
    {
        return $this->hasMany(AiModerationLog::class);
    }

    public function latestAiModerationLog(): HasOne
    {
        return $this->hasOne(AiModerationLog::class)->latestOfMany();
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeExpired($query)
    {
        return $query->where('expiry_date', '<', now())
            ->whereIn('status', ['published', 'paused']);
    }

    public function scopeSearch($query, string $keyword)
    {
        return $query->whereFullText(['title', 'description'], $keyword);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    public function isOwner(User $user): bool
    {
        return $this->user_id === $user->id;
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    public function isExpired(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }
}
