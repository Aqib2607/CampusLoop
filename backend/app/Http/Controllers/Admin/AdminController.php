<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\AuditLog;
use App\Models\Conversation;
use App\Models\Listing;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * GET /api/v1/admin/dashboard
     */
    public function dashboard(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => [
                'users'            => User::count(),
                'active_users'     => User::where('status', 'active')->count(),
                'suspended_users'  => User::where('is_suspended', true)->count(),
                'listings'         => Listing::count(),
                'published_listings' => Listing::where('status', 'published')->count(),
                'pending_listings' => Listing::where('status', 'pending')->count(),
                'conversations'    => Conversation::count(),
                'reports'          => Report::count(),
                'open_reports'     => Report::where('status', 'open')->count(),
            ],
        ]);
    }

    /**
     * GET /api/v1/admin/analytics
     */
    public function analytics(): JsonResponse
    {
        $stats = \App\Models\DailyStatistic::orderBy('date', 'desc')->take(30)->get();

        return response()->json([
            'success' => true,
            'data'    => $stats,
        ]);
    }

    /**
     * GET /api/v1/admin/users
     */
    public function users(Request $request): JsonResponse
    {
        $users = User::with(['roles', 'ratingSummary'])
            ->when($request->input('search'), function ($q, $s) {
                $q->where('name', 'like', "%{$s}%")
                    ->orWhere('email', 'like', "%{$s}%");
            })
            ->when($request->input('status'), fn ($q, $s) => $q->where('status', $s))
            ->when($request->input('role'), fn ($q, $r) => $q->role($r))
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => UserResource::collection($users->items()),
            'meta'    => ['total' => $users->total(), 'current_page' => $users->currentPage()],
        ]);
    }

    /**
     * PUT /api/v1/admin/users/{id}
     */
    public function updateUser(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'role'   => 'sometimes|string|in:student,teacher,staff,moderator,admin',
            'status' => 'sometimes|in:active,suspended,banned',
        ]);

        if (isset($data['role'])) {
            $user->syncRoles([$data['role']]);
        }

        if (isset($data['status'])) {
            $user->update(['status' => $data['status']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'User updated.',
            'data'    => new UserResource($user->fresh(['roles'])),
        ]);
    }

    /**
     * DELETE /api/v1/admin/users/{id}
     */
    public function deleteUser(User $user): JsonResponse
    {
        if ($user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Cannot delete admin users.'], 403);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['success' => true, 'message' => 'User deleted.']);
    }
}
