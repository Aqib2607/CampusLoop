<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Models\UserSetting;
use App\Services\Audit\AuditLogService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private readonly AuditLogService $auditLogService
    ) {}

    public function register(array $data): array
    {
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'username' => $data['username'] ?? null,
            'phone'    => $data['phone'] ?? null,
            'university' => $data['university'] ?? null,
            'department' => $data['department'] ?? null,
        ]);

        // Assign default role
        $user->assignRole('student');

        // Create default settings
        UserSetting::create(['user_id' => $user->id]);

        event(new Registered($user));

        $this->auditLogService->log('register', 'users', $user->id, null, $user->toArray());

        return [
            'user'  => $user->load('roles'),
            'token' => $user->createToken('api-token')->plainTextToken,
        ];
    }

    public function login(array $credentials, ?string $deviceName = 'api'): array
    {
        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->isSuspended()) {
            throw ValidationException::withMessages([
                'email' => ['Your account has been suspended. Reason: ' . ($user->suspension_reason ?? 'N/A')],
            ]);
        }

        // Update last login
        $user->update(['last_login_at' => now()]);

        $this->auditLogService->log('login', 'users', $user->id);

        return [
            'user'  => $user->load(['roles', 'settings']),
            'token' => $user->createToken($deviceName)->plainTextToken,
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
        $this->auditLogService->log('logout', 'users', $user->id);
    }

    public function revokeAllTokens(User $user): void
    {
        $user->tokens()->delete();
        $this->auditLogService->log('token_revocation', 'users', $user->id);
    }
}
