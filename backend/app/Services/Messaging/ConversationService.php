<?php

namespace App\Services\Messaging;

use App\Models\Conversation;
use App\Models\User;
use App\Repositories\ConversationRepository;

class ConversationService
{
    public function __construct(
        private readonly ConversationRepository $repo
    ) {}

    public function getOrCreate(User $buyer, int $sellerId, int $listingId): Conversation
    {
        // Check existing conversation
        $existing = Conversation::where('listing_id', $listingId)
            ->where('buyer_id', $buyer->id)
            ->where('seller_id', $sellerId)
            ->first();

        if ($existing) {
            return $existing->load(['listing', 'buyer', 'seller', 'latestMessage']);
        }

        // Prevent self-messaging
        if ($buyer->id === $sellerId) {
            throw new \RuntimeException('You cannot start a conversation with yourself.');
        }

        return Conversation::create([
            'listing_id' => $listingId,
            'buyer_id'   => $buyer->id,
            'seller_id'  => $sellerId,
            'status'     => 'active',
        ])->load(['listing', 'buyer', 'seller']);
    }

    public function getUserConversations(User $user)
    {
        return Conversation::with(['listing.images', 'buyer', 'seller', 'latestMessage'])
            ->where(function ($q) use ($user) {
                $q->where('buyer_id', $user->id)
                    ->orWhere('seller_id', $user->id);
            })
            ->where('status', 'active')
            ->orderByDesc('last_message_at')
            ->paginate(20);
    }

    public function block(Conversation $conversation): Conversation
    {
        $conversation->update(['status' => 'blocked']);
        return $conversation->fresh();
    }

    public function close(Conversation $conversation): Conversation
    {
        $conversation->update(['status' => 'closed']);
        return $conversation->fresh();
    }
}
