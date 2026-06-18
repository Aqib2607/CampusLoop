<?php

namespace Database\Factories;

use App\Models\MessageAttachment;
use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;

class MessageAttachmentFactory extends Factory
{
    protected $model = MessageAttachment::class;

    public function definition(): array
    {
        $types = ['image/jpeg', 'application/pdf', 'application/msword', 'audio/mpeg'];
        $type = fake()->randomElement($types);
        
        $url = 'https://picsum.photos/800/600';
        if ($type === 'application/pdf') $url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
        if ($type === 'audio/mpeg') $url = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

        return [
            'message_id' => Message::factory(),
            'file_url' => $url,
            'file_type' => $type,
            'file_size' => fake()->numberBetween(1024, 5000000), // 1KB to 5MB
        ];
    }
}
