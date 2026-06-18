<?php

namespace App\Repositories;

use App\Models\Conversation;

class ConversationRepository
{
    public function find(int $id): ?Conversation
    {
        return Conversation::find($id);
    }
}
