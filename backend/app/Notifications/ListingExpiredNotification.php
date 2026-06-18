<?php

namespace App\Notifications;

use App\Models\Listing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ListingExpiredNotification extends Notification implements ShouldQueue
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
            'type'       => 'listing_expired',
            'title'      => 'Listing Expired',
            'message'    => "Your listing \"{$this->listing->title}\" has expired and been archived. Renew it to make it active again.",
            'listing_id' => $this->listing->id,
        ];
    }
}
