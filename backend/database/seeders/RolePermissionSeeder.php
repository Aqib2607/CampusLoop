<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ── Define Permissions ──────────────────────────────────────────────
        $permissions = [
            // Listings
            'listing.create', 'listing.update', 'listing.delete',
            'listing.approve', 'listing.reject', 'listing.view-pending',

            // Users
            'user.view', 'user.suspend', 'user.restore', 'user.delete', 'user.change-role',

            // Reports
            'report.view', 'report.resolve',

            // Reviews
            'review.create', 'review.delete',

            // Categories
            'category.create', 'category.update', 'category.delete',

            // AI / API Keys
            'ai-provider.view', 'ai-provider.create', 'ai-provider.update', 'ai-provider.delete',
            'api-key.view', 'api-key.create', 'api-key.disable', 'api-key.delete',

            // Analytics
            'analytics.view', 'analytics.view-platform',

            // Audit
            'audit.view-own', 'audit.view-moderation', 'audit.view-system',

            // Admin
            'admin.dashboard', 'admin.manage-settings', 'admin.manage-moderators',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'sanctum']);
        }

        // ── Create Roles & Assign Permissions ───────────────────────────────

        // Student
        Role::firstOrCreate(['name' => 'student', 'guard_name' => 'sanctum'])
            ->syncPermissions([
                'listing.create', 'listing.update', 'listing.delete',
                'review.create', 'review.delete',
                'report.view',
                'analytics.view',
                'audit.view-own',
            ]);

        // Teacher  (same as student for marketplace purposes)
        Role::firstOrCreate(['name' => 'teacher', 'guard_name' => 'sanctum'])
            ->syncPermissions([
                'listing.create', 'listing.update', 'listing.delete',
                'review.create', 'review.delete',
                'report.view',
                'analytics.view',
                'audit.view-own',
            ]);

        // Staff  (same base permissions)
        Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'sanctum'])
            ->syncPermissions([
                'listing.create', 'listing.update', 'listing.delete',
                'review.create', 'review.delete',
                'report.view',
                'analytics.view',
                'audit.view-own',
            ]);

        // Moderator
        Role::firstOrCreate(['name' => 'moderator', 'guard_name' => 'sanctum'])
            ->syncPermissions([
                'listing.create', 'listing.update', 'listing.delete',
                'listing.approve', 'listing.reject', 'listing.view-pending',
                'review.create', 'review.delete',
                'report.view', 'report.resolve',
                'user.view', 'user.suspend', 'user.restore',
                'ai-provider.view',
                'api-key.view', 'api-key.create', 'api-key.disable',
                'analytics.view', 'analytics.view-platform',
                'audit.view-own', 'audit.view-moderation',
                'admin.dashboard',
            ]);

        // Admin — everything
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'sanctum'])
            ->syncPermissions(Permission::all());

        $this->command->info('✅ Roles and permissions seeded.');
    }
}
