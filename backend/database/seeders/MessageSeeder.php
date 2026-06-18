<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MessageSeeder extends Seeder
{
    public function run(): void
    {
        $conversations = DB::table('conversations')->select('id', 'buyer_id', 'seller_id', 'created_at')->get();
        if ($conversations->isEmpty()) return;

        // 50,000 messages total across 2500 conversations (avg 20 messages per conversation)
        $messages = [];
        $types = ['text', 'text', 'text', 'text', 'image', 'pdf', 'document', 'voice'];
        $statuses = ['sent', 'delivered', 'seen', 'seen'];

        foreach ($conversations as $conv) {
            $numMessages = rand(5, 35);
            $currentDate = Carbon::parse($conv->created_at);

            for ($i = 0; $i < $numMessages; $i++) {
                $senderId = rand(0, 1) ? $conv->buyer_id : $conv->seller_id;
                $currentDate->addMinutes(rand(1, 60)); // sequential messages

                $messages[] = [
                    'conversation_id' => $conv->id,
                    'sender_id' => $senderId,
                    'message_type' => $types[array_rand($types)],
                    'content' => fake()->realText(rand(20, 100)),
                    'status' => $statuses[array_rand($statuses)],
                    'created_at' => $currentDate->format('Y-m-d H:i:s'),
                ];
            }
            
            // Limit memory usage
            if (count($messages) >= 2000) {
                DB::table('messages')->insert($messages);
                $messages = [];
            }
        }

        if (count($messages) > 0) {
            DB::table('messages')->insert($messages);
        }
    }
}
