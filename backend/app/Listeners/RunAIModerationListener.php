<?php

namespace App\Listeners;

use App\Events\ListingCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class RunAIModerationListener
{
    /**
     * Create the event listener.
     */
    public function __construct(private readonly \App\Services\Moderation\ModerationAIService $aiService)
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(ListingCreated $event): void
    {
        try {
            $this->aiService->analyzeListing($event->listing);
        } catch (\Throwable $e) {
            logger()->warning('AI moderation failed for listing ' . $event->listing->id . ': ' . $e->getMessage());
        }
    }
}
