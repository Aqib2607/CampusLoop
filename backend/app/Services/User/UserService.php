<?php

namespace App\Services\User;

use App\Models\User;
use App\Models\UserSetting;
use App\Services\Audit\AuditLogService;
use App\Services\Media\CloudinaryService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(
        private readonly CloudinaryService $cloudinaryService,
        private readonly AuditLogService $auditLogService
    ) {}

    public function updateProfile(User $user, array $data): User
    {
        $old = $user->only(['name', 'phone', 'bio', 'university', 'department', 'username']);

        $user->update(array_filter([
            'name'       => $data['name'] ?? null,
            'username'   => $data['username'] ?? null,
            'phone'      => $data['phone'] ?? null,
            'bio'        => $data['bio'] ?? null,
            'university' => $data['university'] ?? null,
            'department' => $data['department'] ?? null,
        ], fn ($v) => $v !== null));

        $this->auditLogService->logModelChange('update', 'users', $user->id, $old, $user->fresh()->toArray());

        return $user->fresh(['settings', 'roles']);
    }

    public function updateAvatar(User $user, UploadedFile $file): User
    {
        // Delete old avatar if exists
        if ($user->avatar) {
            // Extract public_id if it's a Cloudinary URL — we store it differently in the column
            // Avatar column stores only the URL; if we had public_id stored, we'd delete via that
        }

        $result = $this->cloudinaryService->uploadImage($file, 'campusloop/avatars');

        $user->update(['avatar' => $result['url']]);

        return $user->fresh();
    }

    public function updateSettings(User $user, array $data): UserSetting
    {
        $settings = $user->settings ?? UserSetting::create(['user_id' => $user->id]);

        $settings->update(array_filter([
            'default_expiry_days' => $data['default_expiry_days'] ?? null,
            'email_notifications' => $data['email_notifications'] ?? null,
            'push_notifications'  => $data['push_notifications'] ?? null,
            'privacy_mode'        => $data['privacy_mode'] ?? null,
        ], fn ($v) => $v !== null));

        return $settings->fresh();
    }

    public function suspendUser(User $target, string $reason, User $moderator): User
    {
        $old = $target->only(['status', 'is_suspended']);

        $target->update([
            'is_suspended'      => true,
            'status'            => 'suspended',
            'suspended_at'      => now(),
            'suspension_reason' => $reason,
        ]);

        // Revoke all tokens
        $target->tokens()->delete();

        $this->auditLogService->log(
            'suspend',
            'users',
            $target->id,
            $old,
            $target->fresh()->only(['status', 'is_suspended']),
            "Suspended by moderator #{$moderator->id}: {$reason}"
        );

        return $target->fresh();
    }

    public function restoreUser(User $target, User $moderator): User
    {
        $old = $target->only(['status', 'is_suspended']);

        $target->update([
            'is_suspended'      => false,
            'status'            => 'active',
            'suspended_at'      => null,
            'suspension_reason' => null,
        ]);

        $this->auditLogService->log(
            'restore',
            'users',
            $target->id,
            $old,
            $target->fresh()->only(['status', 'is_suspended']),
            "Restored by moderator #{$moderator->id}"
        );

        return $target->fresh();
    }
}
