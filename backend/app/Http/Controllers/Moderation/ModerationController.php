<?php

namespace App\Http\Controllers\Moderation;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Report;
use App\Models\User;
use App\Repositories\ListingRepository;
use App\Services\Moderation\ModerationService;
use App\Services\User\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ModerationController extends Controller
{
    public function __construct(
        private readonly ModerationService $moderationService,
        private readonly UserService $userService,
        private readonly ListingRepository $listingRepo
    ) {}

    /**
     * GET /api/v1/moderator/listings/pending
     */
    public function pendingListings(): JsonResponse
    {
        $listings = $this->listingRepo->getPending();

        return response()->json([
            'success' => true,
            'data'    => \App\Http\Resources\ListingResource::collection($listings->items()),
            'meta'    => [
                'current_page' => $listings->currentPage(),
                'total'        => $listings->total(),
            ],
        ]);
    }

    /**
     * POST /api/v1/moderator/listings/{id}/approve
     */
    public function approveListing(Request $request, Listing $listing): JsonResponse
    {
        $listing = $this->moderationService->approveListing($listing, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Listing approved and published.',
            'data'    => new \App\Http\Resources\ListingResource($listing),
        ]);
    }

    /**
     * POST /api/v1/moderator/listings/{id}/reject
     */
    public function rejectListing(Request $request, Listing $listing): JsonResponse
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $listing = $this->moderationService->rejectListing(
            $listing,
            $request->user(),
            $request->input('reason')
        );

        return response()->json([
            'success' => true,
            'message' => 'Listing rejected.',
            'data'    => new \App\Http\Resources\ListingResource($listing),
        ]);
    }

    /**
     * GET /api/v1/moderator/reports
     */
    public function reports(Request $request): JsonResponse
    {
        $reports = Report::with(['reporter', 'assignedModerator'])
            ->when($request->input('status'), fn ($q, $s) => $q->where('status', $s))
            ->when($request->input('type'), fn ($q, $t) => $q->where('report_type', $t))
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $reports->items(),
            'meta'    => ['total' => $reports->total()],
        ]);
    }

    /**
     * POST /api/v1/moderator/reports/{id}/resolve
     */
    public function resolveReport(Request $request, Report $report): JsonResponse
    {
        $request->validate([
            'action' => 'required|in:resolve,dismiss',
            'notes'  => 'nullable|string|max:1000',
        ]);

        $report = $this->moderationService->resolveReport(
            $report,
            $request->user(),
            $request->input('action'),
            $request->input('notes', '')
        );

        return response()->json([
            'success' => true,
            'message' => 'Report ' . $report->status . '.',
            'data'    => $report,
        ]);
    }

    /**
     * POST /api/v1/moderator/users/{id}/suspend
     */
    public function suspendUser(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $user = $this->userService->suspendUser($user, $request->input('reason'), $request->user());

        return response()->json([
            'success' => true,
            'message' => 'User suspended.',
            'data'    => new \App\Http\Resources\UserResource($user),
        ]);
    }

    /**
     * POST /api/v1/moderator/users/{id}/restore
     */
    public function restoreUser(Request $request, User $user): JsonResponse
    {
        $user = $this->userService->restoreUser($user, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'User restored.',
            'data'    => new \App\Http\Resources\UserResource($user),
        ]);
    }
}
