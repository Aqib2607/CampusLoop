<?php

namespace App\Http\Controllers\Review;

use App\Http\Controllers\Controller;
use App\Models\RatingSummary;
use App\Models\Review;
use App\Notifications\ReviewReceivedNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * POST /api/v1/reviews
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'reviewed_user_id' => 'required|integer|exists:users,id|different:' . $request->user()->id,
            'listing_id'       => 'required|integer|exists:listings,id',
            'rating'           => 'required|integer|min:1|max:5',
            'review_text'      => 'nullable|string|max:1000',
        ]);

        // One review per reviewer per listing
        $existing = Review::where('reviewer_id', $request->user()->id)
            ->where('listing_id', $data['listing_id'])
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this transaction.',
            ], 422);
        }

        $review = Review::create(array_merge($data, [
            'reviewer_id' => $request->user()->id,
        ]));

        // Update rating summary
        $this->updateRatingSummary($data['reviewed_user_id']);

        // Notify reviewed user
        $review->reviewedUser->notify(new ReviewReceivedNotification($review->load('reviewer')));

        return response()->json([
            'success' => true,
            'message' => 'Review submitted.',
            'data'    => $review->load('reviewer'),
        ], 201);
    }

    /**
     * DELETE /api/v1/reviews/{id}
     */
    public function destroy(Request $request, Review $review): JsonResponse
    {
        if ($review->reviewer_id !== $request->user()->id && ! $request->user()->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        $reviewedUserId = $review->reviewed_user_id;
        $review->delete();

        $this->updateRatingSummary($reviewedUserId);

        return response()->json(['success' => true, 'message' => 'Review deleted.']);
    }

    private function updateRatingSummary(int $userId): void
    {
        $reviews = Review::where('reviewed_user_id', $userId);
        $count   = $reviews->count();

        if ($count === 0) {
            RatingSummary::updateOrCreate(
                ['user_id' => $userId],
                ['average_rating' => 0, 'review_count' => 0, 'positive_percentage' => 0]
            );
            return;
        }

        $avg      = $reviews->avg('rating');
        $positive = $reviews->where('rating', '>=', 4)->count();

        RatingSummary::updateOrCreate(
            ['user_id' => $userId],
            [
                'average_rating'      => round($avg, 2),
                'review_count'        => $count,
                'positive_percentage' => round(($positive / $count) * 100, 2),
            ]
        );
    }
}
