<?php

namespace App\Notifications;

use App\Models\Listing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ListingApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Listing $listing) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type'       => 'listing_approved',
            'title'      => 'Listing Approved',
            'message'    => "Your listing \"{$this->listing->title}\" has been approved and is now live.",
            'listing_id' => $this->listing->id,
        ];
    }
}
