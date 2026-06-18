<?php

use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

test('regular users cannot access admin analytics', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    // Assuming role 'user' is default
    actingAs($user)->getJson('/api/v1/admin/analytics')->assertForbidden();
});

test('admin can access admin analytics', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    actingAs($admin)->getJson('/api/v1/admin/analytics')->assertOk();
});

test('moderator can view users but cannot delete them', function () {
    /** @var \App\Models\User $moderator */
    $moderator = User::factory()->create();
    $moderator->assignRole('moderator');

    $target = User::factory()->create();

    // View users should be OK
    actingAs($moderator)->getJson('/api/v1/admin/users')->assertOk();

    // Delete user should fail
    actingAs($moderator)->deleteJson("/api/v1/admin/users/{$target->id}")->assertForbidden();
});

test('admin can delete users', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $target = User::factory()->create();

    actingAs($admin)->deleteJson("/api/v1/admin/users/{$target->id}")->assertOk();
});
