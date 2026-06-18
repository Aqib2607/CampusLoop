<?php

namespace App\Services\Moderation;

use App\Models\Listing;
use App\Models\ModerationAction;
use App\Models\Report;
use App\Models\User;
use App\Notifications\ListingApprovedNotification;
use App\Notifications\ListingRejectedNotification;
use App\Services\Audit\AuditLogService;

class ModerationService
{
    public function __construct(
        private readonly AuditLogService $auditLogService
    ) {}

    public function approveListing(Listing $listing, User $moderator): Listing
    {
        $old = $listing->only(['status']);

        $listing->update([
            'status'       => 'published',
            'published_at' => now(),
        ]);

        $this->logAction($moderator, 'listing', $listing->id, 'approve');
        $this->auditLogService->log('approve_listing', 'listings', $listing->id, $old, ['status' => 'published']);

        // Notify listing owner
        $listing->user->notify(new ListingApprovedNotification($listing));

        return $listing->fresh();
    }

    public function rejectListing(Listing $listing, User $moderator, string $reason): Listing
    {
        $old = $listing->only(['status']);

        $listing->update([
            'status'           => 'rejected',
            'rejection_reason' => $reason,
        ]);

        $this->logAction($moderator, 'listing', $listing->id, 'reject', $reason);
        $this->auditLogService->log('reject_listing', 'listings', $listing->id, $old, ['status' => 'rejected', 'reason' => $reason]);

        // Notify listing owner
        $listing->user->notify(new ListingRejectedNotification($listing, $reason));

        return $listing->fresh();
    }

    public function resolveReport(Report $report, User $moderator, string $action, string $notes = ''): Report
    {
        $status = match ($action) {
            'resolve'  => 'resolved',
            'dismiss'  => 'dismissed',
            default    => 'resolved',
        };

        $report->update([
            'status'           => $status,
            'resolution_notes' => $notes,
            'resolved_at'      => now(),
        ]);

        $this->logAction($moderator, 'report', $report->id, $action, $notes);

        return $report->fresh();
    }

    private function logAction(User $moderator, string $targetType, int $targetId, string $action, string $notes = ''): ModerationAction
    {
        return ModerationAction::create([
            'moderator_id' => $moderator->id,
            'target_type'  => $targetType,
            'target_id'    => $targetId,
            'action_type'  => $action,
            'notes'        => $notes,
        ]);
    }
}
