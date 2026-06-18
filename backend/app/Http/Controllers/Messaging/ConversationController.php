<?php

namespace App\Http\Controllers\Messaging;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Services\Messaging\ConversationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function __construct(
        private readonly ConversationService $conversationService
    ) {}

    /**
     * GET /api/v1/conversations
     */
    public function index(Request $request): JsonResponse
    {
        $conversations = $this->conversationService->getUserConversations($request->user());

        return response()->json([
            'success' => true,
            'data'    => $conversations->items(),
            'meta'    => [
                'current_page' => $conversations->currentPage(),
                'per_page'     => $conversations->perPage(),
                'total'        => $conversations->total(),
            ],
        ]);
    }

    /**
     * POST /api/v1/conversations
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'listing_id' => 'required|integer|exists:listings,id',
            'seller_id'  => 'required|integer|exists:users,id',
        ]);

        $conversation = $this->conversationService->getOrCreate(
            $request->user(),
            $request->input('seller_id'),
            $request->input('listing_id')
        );

        return response()->json([
            'success' => true,
            'data'    => $conversation,
        ], 201);
    }

    /**
     * POST /api/v1/conversations/{id}/block
     */
    public function block(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorize('view', $conversation);

        $conversation = $this->conversationService->block($conversation);

        return response()->json([
            'success' => true,
            'message' => 'Conversation blocked.',
            'data'    => $conversation,
        ]);
    }
}
