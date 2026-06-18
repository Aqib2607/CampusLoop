<?php

namespace App\Services\Messaging;

use App\Events\MessageDeliveredEvent;
use App\Events\MessageSentEvent;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Notifications\NewMessageNotification;
use Illuminate\Http\UploadedFile;

class MessageService
{
    public function __construct(
        private readonly AttachmentService $attachmentService
    ) {}

    public function send(Conversation $conversation, User $sender, array $data, ?UploadedFile $file = null): Message
    {
        if ($conversation->status !== 'active') {
            throw new \RuntimeException('Cannot send messages to a blocked or closed conversation.');
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id'       => $sender->id,
            'message_type'    => $data['message_type'] ?? 'text',
            'content'         => $data['content'] ?? null,
            'status'          => 'sent',
        ]);

        // Handle file attachment
        if ($file) {
            $this->attachmentService->upload($message, $file);
        }

        // Update conversation timestamp
        $conversation->update(['last_message_at' => now()]);

        // Broadcast event
        broadcast(new MessageSentEvent($message, $conversation))->toOthers();

        // Notify the other participant
        $recipient = $conversation->buyer_id === $sender->id
            ? $conversation->seller
            : $conversation->buyer;

        $recipient->notify(new NewMessageNotification($message));

        return $message->load('attachments');
    }

    public function markDelivered(Message $message): Message
    {
        $message->update(['status' => 'delivered', 'delivered_at' => now()]);
        broadcast(new MessageDeliveredEvent($message));
        return $message;
    }

    public function markSeen(Conversation $conversation, User $user): void
    {
        Message::where('conversation_id', $conversation->id)
            ->where('sender_id', '!=', $user->id)
            ->whereIn('status', ['sent', 'delivered'])
            ->update(['status' => 'seen', 'seen_at' => now()]);
    }

    public function getMessages(Conversation $conversation): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        return Message::with(['sender', 'attachments'])
            ->where('conversation_id', $conversation->id)
            ->latest()
            ->paginate(50);
    }
}
