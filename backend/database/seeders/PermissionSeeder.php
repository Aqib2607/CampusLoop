<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'listing.create', 'listing.update', 'listing.delete',
            'listing.approve', 'listing.reject', 'listing.view-pending',
            'user.view', 'user.suspend', 'user.restore', 'user.delete', 'user.change-role',
            'report.view', 'report.resolve',
            'review.create', 'review.delete',
            'category.create', 'category.update', 'category.delete',
            'ai-provider.view', 'ai-provider.create', 'ai-provider.update', 'ai-provider.delete',
            'api-key.view', 'api-key.create', 'api-key.disable', 'api-key.delete',
            'analytics.view', 'analytics.view-platform',
            'audit.view-own', 'audit.view-moderation', 'audit.view-system',
            'admin.dashboard', 'admin.manage-settings', 'admin.manage-moderators',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'sanctum']);
        }

        $basePermissions = [
            'listing.create', 'listing.update', 'listing.delete',
            'review.create', 'review.delete', 'report.view', 'analytics.view', 'audit.view-own',
        ];

        foreach (['student', 'teacher', 'staff'] as $roleName) {
            $role = Role::where('name', $roleName)->first();
            if ($role) $role->syncPermissions($basePermissions);
        }

        $moderator = Role::where('name', 'moderator')->first();
        if ($moderator) {
            $moderator->syncPermissions(array_merge($basePermissions, [
                'listing.approve', 'listing.reject', 'listing.view-pending',
                'report.resolve', 'user.view', 'user.suspend', 'user.restore',
                'ai-provider.view', 'api-key.view', 'api-key.create', 'api-key.disable',
                'analytics.view-platform', 'audit.view-moderation', 'admin.dashboard',
            ]));
        }

        $admin = Role::where('name', 'admin')->first();
        if ($admin) $admin->syncPermissions(Permission::all());
    }
}
