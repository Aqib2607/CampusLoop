<?php

use App\Models\Conversation;
use App\Models\Listing;
use App\Models\Message;
use App\Models\User;
use function Pest\Laravel\actingAs;

test('users can start a conversation on a listing', function () {
    /** @var \App\Models\User $seller */
    $seller = User::factory()->create();
    /** @var \App\Models\User $buyer */
    $buyer = User::factory()->create();
    $listing = Listing::factory()->create(['user_id' => $seller->id]);

    actingAs($buyer)->postJson('/api/v1/conversations', [
        'listing_id' => $listing->id,
        'seller_id'  => $seller->id,
    ])->assertCreated()
      ->assertJsonPath('data.buyer_id', $buyer->id)
      ->assertJsonPath('data.seller_id', $seller->id);
});

test('users cannot start a conversation with themselves', function () {
    /** @var \App\Models\User $seller */
    $seller = User::factory()->create();
    $listing = Listing::factory()->create(['user_id' => $seller->id]);

    actingAs($seller)->postJson('/api/v1/conversations', [
        'listing_id' => $listing->id,
        'seller_id'  => $seller->id,
    ])->assertStatus(500); // Because we throw \RuntimeException in service
});

test('users can send a text message in an active conversation', function () {
    /** @var \App\Models\User $seller */
    $seller = User::factory()->create();
    /** @var \App\Models\User $buyer */
    $buyer = User::factory()->create();
    $listing = Listing::factory()->create(['user_id' => $seller->id]);
    
    $conversation = Conversation::factory()->create([
        'listing_id' => $listing->id,
        'buyer_id'   => $buyer->id,
        'seller_id'  => $seller->id,
        'status'     => 'active'
    ]);

    actingAs($buyer)->postJson("/api/v1/conversations/{$conversation->id}/messages", [
        'message_type' => 'text',
        'content'      => 'Hello, is this available?',
    ])->assertCreated()
      ->assertJsonPath('data.content', 'Hello, is this available?');
});

test('blocked conversations reject new messages', function () {
    /** @var \App\Models\User $seller */
    $seller = User::factory()->create();
    /** @var \App\Models\User $buyer */
    $buyer = User::factory()->create();
    $listing = Listing::factory()->create(['user_id' => $seller->id]);
    
    $conversation = Conversation::factory()->create([
        'listing_id' => $listing->id,
        'buyer_id'   => $buyer->id,
        'seller_id'  => $seller->id,
        'status'     => 'blocked'
    ]);

    actingAs($buyer)->postJson("/api/v1/conversations/{$conversation->id}/messages", [
        'message_type' => 'text',
        'content'      => 'Hello?',
    ])->assertStatus(500);
});
