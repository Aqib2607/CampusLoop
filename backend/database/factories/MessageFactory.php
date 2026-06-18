<?php

namespace Database\Factories;

use App\Models\Message;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class MessageFactory extends Factory
{
    protected $model = Message::class;

    public function definition(): array
    {
        return [
            'conversation_id' => Conversation::factory(),
            'sender_id' => User::factory(),
            'message_type' => fake()->randomElement(['text', 'text', 'text', 'image', 'pdf', 'document', 'voice']),
            'content' => fake()->realText(100),
            'status' => fake()->randomElement(['sent', 'delivered', 'seen', 'seen']),
        ];
    }
}
