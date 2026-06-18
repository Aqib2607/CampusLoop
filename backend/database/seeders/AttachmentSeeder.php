<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AttachmentSeeder extends Seeder
{
    public function run(): void
    {
        // Only attach files to messages that are not of type 'text'
        $messages = DB::table('messages')
            ->where('message_type', '!=', 'text')
            ->select('id', 'message_type')
            ->get();

        if ($messages->isEmpty()) return;

        $attachments = [];

        foreach ($messages as $msg) {
            $url = 'https://picsum.photos/800/600';
            $mime = 'image/jpeg';
            
            if ($msg->message_type === 'pdf') {
                $url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
                $mime = 'application/pdf';
            } elseif ($msg->message_type === 'document') {
                $mime = 'application/msword';
            } elseif ($msg->message_type === 'voice') {
                $url = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
                $mime = 'audio/mpeg';
            }

            $attachments[] = [
                'message_id' => $msg->id,
                'file_url' => $url,
                'file_type' => $mime,
                'file_size' => rand(1024, 5000000),
            ];

            if (count($attachments) >= 1000) {
                DB::table('message_attachments')->insert($attachments);
                $attachments = [];
            }
        }

        if (count($attachments) > 0) {
            DB::table('message_attachments')->insert($attachments);
        }
    }
}
