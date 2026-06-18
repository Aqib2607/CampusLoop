<?php

namespace App\Notifications;

use App\Models\Listing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ListingRejectedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly Listing $listing,
        private readonly string $reason
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type'       => 'listing_rejected',
            'title'      => 'Listing Rejected',
            'message'    => "Your listing \"{$this->listing->title}\" was rejected. Reason: {$this->reason}",
            'listing_id' => $this->listing->id,
            'reason'     => $this->reason,
        ];
    }
}
