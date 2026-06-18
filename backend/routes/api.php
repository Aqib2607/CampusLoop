<?php

use App\Http\Controllers\AI\AiProviderController;
use App\Http\Controllers\AI\ApiKeyController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Marketplace\CategoryController;
use App\Http\Controllers\Marketplace\FavoriteController;
use App\Http\Controllers\Marketplace\ListingController;
use App\Http\Controllers\Messaging\ConversationController;
use App\Http\Controllers\Messaging\MessageController;
use App\Http\Controllers\Moderation\ModerationController;
use App\Http\Controllers\Notification\NotificationController;
use App\Http\Controllers\Report\ReportController;
use App\Http\Controllers\Review\ReviewController;
use App\Http\Controllers\User\UserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| API Routes — CampusLoop v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ── Public Routes ──────────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('register',        [AuthController::class, 'register']);
        Route::post('login',           [AuthController::class, 'login']);
        Route::post('forgot-password', [PasswordResetController::class, 'forgotPassword']);
        Route::post('reset-password',  [PasswordResetController::class, 'resetPassword']);
    });

    // Public marketplace browsing
    Route::get('listings',          [ListingController::class, 'index']);
    Route::get('listings/{listing}', [ListingController::class, 'show'])->withTrashed(false);
    Route::get('categories',         [CategoryController::class, 'index']);

    // Public user ratings
    Route::get('users/{id}/reviews', [UserController::class, 'userReviews']);
    Route::get('users/{id}/rating',  [UserController::class, 'userRating']);

    // ── Authenticated Routes ───────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        Broadcast::routes();

        // Auth
        Route::prefix('auth')->group(function () {
            Route::post('logout',        [AuthController::class, 'logout']);
            Route::get('me',             [AuthController::class, 'me']);
            Route::delete('tokens',      [AuthController::class, 'revokeAllTokens']);
        });

        // Profile & Settings
        Route::get('profile',              [UserController::class, 'profile']);
        Route::put('profile',              [UserController::class, 'updateProfile']);
        Route::post('profile/avatar',      [UserController::class, 'updateAvatar']);
        Route::get('settings',             [UserController::class, 'getSettings']);
        Route::put('settings',             [UserController::class, 'updateSettings']);

        // Marketplace — owner actions
        Route::post('listings',                        [ListingController::class, 'store']);
        Route::put('listings/{listing}',               [ListingController::class, 'update']);
        Route::delete('listings/{listing}',            [ListingController::class, 'destroy']);
        Route::post('listings/{listing}/pause',        [ListingController::class, 'pause']);
        Route::post('listings/{listing}/resume',       [ListingController::class, 'resume']);
        Route::post('listings/{listing}/sold',         [ListingController::class, 'markSold']);
        Route::post('listings/{listing}/renew',        [ListingController::class, 'renew']);
        Route::post('listings/{listing}/images',       [ListingController::class, 'uploadImages']);
        Route::delete('listing-images/{id}',           [ListingController::class, 'deleteImage']);
        Route::get('my-listings',                      [ListingController::class, 'myListings']);

        // Favorites
        Route::get('favorites',                [FavoriteController::class, 'index']);
        Route::post('favorites',               [FavoriteController::class, 'store']);
        Route::delete('favorites/{listing_id}',[FavoriteController::class, 'destroy']);

        // Messaging
        Route::get('conversations',                        [ConversationController::class, 'index']);
        Route::post('conversations',                       [ConversationController::class, 'store']);
        Route::post('conversations/{conversation}/block',  [ConversationController::class, 'block']);
        Route::get('conversations/{conversation}/messages',[MessageController::class, 'index']);
        Route::post('conversations/{conversation}/messages',[MessageController::class, 'store']);

        // Reviews
        Route::post('reviews',          [ReviewController::class, 'store']);
        Route::delete('reviews/{review}',[ReviewController::class, 'destroy']);

        // Reports
        Route::get('reports',                   [ReportController::class, 'index']);
        Route::post('reports/{type}',           [ReportController::class, 'store']);

        // Notifications
        Route::get('notifications',             [NotificationController::class, 'index']);
        Route::post('notifications/{id}/read',  [NotificationController::class, 'markRead']);
        Route::post('notifications/read-all',   [NotificationController::class, 'markAllRead']);
        Route::delete('notifications/{id}',     [NotificationController::class, 'destroy']);

        // ── Moderator Routes ───────────────────────────────────────────────
        Route::middleware('role:moderator|admin')->prefix('moderator')->group(function () {
            Route::get('listings/pending',              [ModerationController::class, 'pendingListings']);
            Route::post('listings/{listing}/approve',   [ModerationController::class, 'approveListing']);
            Route::post('listings/{listing}/reject',    [ModerationController::class, 'rejectListing']);
            Route::get('reports',                       [ModerationController::class, 'reports']);
            Route::post('reports/{report}/resolve',     [ModerationController::class, 'resolveReport']);
            Route::post('users/{user}/suspend',         [ModerationController::class, 'suspendUser']);
            Route::post('users/{user}/restore',         [ModerationController::class, 'restoreUser']);
        });

        // ── Admin Routes ───────────────────────────────────────────────────
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            // Categories
            Route::post('categories',              [CategoryController::class, 'store']);
            Route::put('categories/{category}',    [CategoryController::class, 'update']);
            Route::delete('categories/{category}', [CategoryController::class, 'destroy']);

            // Users
            Route::get('users', [\App\Http\Controllers\Admin\AdminController::class, 'users']);
            Route::put('users/{user}', [\App\Http\Controllers\Admin\AdminController::class, 'updateUser']);
            Route::delete('users/{user}', [\App\Http\Controllers\Admin\AdminController::class, 'deleteUser']);
            Route::get('dashboard', [\App\Http\Controllers\Admin\AdminController::class, 'dashboard']);
            Route::get('analytics', [\App\Http\Controllers\Admin\AdminController::class, 'analytics']);

            // AI Providers
            Route::get('ai/providers',                   [AiProviderController::class, 'index']);
            Route::post('ai/providers',                  [AiProviderController::class, 'store']);
            Route::put('ai/providers/{aiProvider}',      [AiProviderController::class, 'update']);
            Route::delete('ai/providers/{aiProvider}',   [AiProviderController::class, 'destroy']);

            // API Keys
            Route::get('api-keys',             [ApiKeyController::class, 'index']);
            Route::post('api-keys',            [ApiKeyController::class, 'store']);
            Route::put('api-keys/{apiKey}',    [ApiKeyController::class, 'update']);
            Route::delete('api-keys/{apiKey}', [ApiKeyController::class, 'destroy']);
            Route::get('api-keys/{apiKey}/logs',[ApiKeyController::class, 'logs']);
        });

        // Moderator can also manage API keys (create/disable, not delete)
        Route::middleware('role:moderator')->prefix('admin')->group(function () {
            Route::get('ai/providers',       [AiProviderController::class, 'index']);
            Route::get('api-keys',           [ApiKeyController::class, 'index']);
            Route::post('api-keys',          [ApiKeyController::class, 'store']);
            Route::put('api-keys/{apiKey}',  [ApiKeyController::class, 'update']);
            Route::get('api-keys/{apiKey}/logs', [ApiKeyController::class, 'logs']);
        });
    });
});
