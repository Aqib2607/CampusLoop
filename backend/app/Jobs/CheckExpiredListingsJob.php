<?php

namespace App\Jobs;

use App\Models\Listing;
use App\Notifications\ListingApprovedNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CheckExpiredListingsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $expired = Listing::expired()->get();

        Log::info("CheckExpiredListingsJob: Processing {$expired->count()} expired listings.");

        foreach ($expired as $listing) {
            $listing->update(['status' => 'archived']);

            // Notify the owner
            try {
                // Use a simple database notification for expiry
                $listing->user->notify(new \App\Notifications\ListingExpiredNotification($listing));
            } catch (\Throwable $e) {
                Log::warning("Failed to notify user #{$listing->user_id} about expired listing #{$listing->id}");
            }
        }

        Log::info("CheckExpiredListingsJob: Archived {$expired->count()} listings.");
    }
}
