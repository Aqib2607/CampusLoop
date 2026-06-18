<?php

namespace App\Http\Controllers\Messaging;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Services\Messaging\MessageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function __construct(
        private readonly MessageService $messageService
    ) {}

    /**
     * GET /api/v1/conversations/{conversation}/messages
     */
    public function index(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorize('view', $conversation);

        // Mark messages as seen
        $this->messageService->markSeen($conversation, $request->user());

        $messages = $this->messageService->getMessages($conversation);

        return response()->json([
            'success' => true,
            'data'    => $messages->items(),
            'meta'    => [
                'current_page' => $messages->currentPage(),
                'per_page'     => $messages->perPage(),
                'total'        => $messages->total(),
            ],
        ]);
    }

    /**
     * POST /api/v1/conversations/{conversation}/messages
     */
    public function store(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorize('view', $conversation);

        $request->validate([
            'message_type' => 'required|in:text,image,pdf,document,voice',
            'content'      => 'required_if:message_type,text|nullable|string|max:5000',
            'file'         => 'nullable|file|max:51200', // 50MB
        ]);

        $message = $this->messageService->send(
            $conversation,
            $request->user(),
            $request->only('message_type', 'content'),
            $request->file('file')
        );

        return response()->json([
            'success' => true,
            'data'    => $message,
        ], 201);
    }
}
