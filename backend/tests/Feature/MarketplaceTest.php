<?php

use App\Models\Category;
use App\Models\Listing;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

test('anyone can view published listings', function () {
    $listing = Listing::factory()->create(['status' => 'published']);

    getJson('/api/v1/listings')
        ->assertOk()
        ->assertJsonFragment(['id' => $listing->id]);
});

test('unauthenticated users cannot create listings', function () {
    $category = Category::factory()->create();

    postJson('/api/v1/listings', [
        'title' => 'Calculus Book',
        'description' => 'Good condition',
        'price' => 50,
        'category_id' => $category->id,
        'condition' => 'good',
        'negotiable' => true
    ])->assertUnauthorized();
});

test('authenticated users can create pending listings', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $category = Category::factory()->create();

    actingAs($user)->postJson('/api/v1/listings', [
        'title' => 'Calculus Book',
        'description' => 'Good condition',
        'price' => 50,
        'category_id' => $category->id,
        'condition' => 'good',
        'negotiable' => true
    ])->assertCreated()
      ->assertJsonPath('data.status', 'pending');
});

test('users can update their own listings', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $listing = Listing::factory()->create(['user_id' => $user->id, 'price' => 50]);

    actingAs($user)->putJson("/api/v1/listings/{$listing->id}", [
        'price' => 40
    ])->assertOk()
      ->assertJsonPath('data.price', '40.00'); // Assuming decimal cast
});

test('users cannot update other peoples listings', function () {
    $owner = User::factory()->create();
    /** @var \App\Models\User $other */
    $other = User::factory()->create();
    $listing = Listing::factory()->create(['user_id' => $owner->id, 'price' => 50]);

    actingAs($other)->putJson("/api/v1/listings/{$listing->id}", [
        'price' => 40
    ])->assertForbidden();
});
