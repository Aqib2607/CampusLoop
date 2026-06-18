<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UpdateProfileRequest;
use App\Http\Requests\User\UpdateSettingsRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\User\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    /**
     * GET /api/v1/profile
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user()->load(['settings', 'roles', 'ratingSummary']);

        return response()->json([
            'success' => true,
            'data'    => new UserResource($user),
        ]);
    }

    /**
     * PUT /api/v1/profile
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $this->userService->updateProfile($request->user(), $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Profile updated.',
            'data'    => new UserResource($user),
        ]);
    }

    /**
     * POST /api/v1/profile/avatar
     */
    public function updateAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120', // 5MB for avatar
        ]);

        $user = $this->userService->updateAvatar($request->user(), $request->file('avatar'));

        return response()->json([
            'success' => true,
            'message' => 'Avatar updated.',
            'data'    => ['avatar' => $user->avatar],
        ]);
    }

    /**
     * GET /api/v1/settings
     */
    public function getSettings(Request $request): JsonResponse
    {
        $settings = $request->user()->settings ?? \App\Models\UserSetting::firstOrCreate(
            ['user_id' => $request->user()->id]
        );

        return response()->json([
            'success' => true,
            'data'    => $settings,
        ]);
    }

    /**
     * PUT /api/v1/settings
     */
    public function updateSettings(UpdateSettingsRequest $request): JsonResponse
    {
        $settings = $this->userService->updateSettings($request->user(), $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Settings updated.',
            'data'    => $settings,
        ]);
    }

    /**
     * GET /api/v1/users/{id}/reviews
     */
    public function userReviews(int $userId): JsonResponse
    {
        $reviews = \App\Models\Review::with('reviewer')
            ->where('reviewed_user_id', $userId)
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $reviews->items(),
            'meta'    => [
                'current_page' => $reviews->currentPage(),
                'total'        => $reviews->total(),
            ],
        ]);
    }

    /**
     * GET /api/v1/users/{id}/rating
     */
    public function userRating(int $userId): JsonResponse
    {
        $rating = \App\Models\RatingSummary::where('user_id', $userId)->first();

        return response()->json([
            'success' => true,
            'data'    => $rating ?? [
                'user_id'            => $userId,
                'average_rating'     => 0,
                'review_count'       => 0,
                'positive_percentage' => 0,
            ],
        ]);
    }
}
