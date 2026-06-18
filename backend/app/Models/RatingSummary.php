<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RatingSummary extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'average_rating',
        'review_count',
        'positive_percentage',
    ];

    protected function casts(): array
    {
        return [
            'average_rating' => 'decimal:2',
            'review_count' => 'integer',
            'positive_percentage' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
