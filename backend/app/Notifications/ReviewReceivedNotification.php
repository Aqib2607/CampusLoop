<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ReviewReceivedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Review $review) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type'        => 'review_received',
            'title'       => 'New Review Received',
            'message'     => "{$this->review->reviewer->name} left you a {$this->review->rating}-star review.",
            'review_id'   => $this->review->id,
            'reviewer_id' => $this->review->reviewer_id,
            'rating'      => $this->review->rating,
        ];
    }
}
