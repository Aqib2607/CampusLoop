<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyStatistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'new_users',
        'new_listings',
        'total_messages',
        'reports_created',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'new_users' => 'integer',
            'new_listings' => 'integer',
            'total_messages' => 'integer',
            'reports_created' => 'integer',
        ];
    }
}
