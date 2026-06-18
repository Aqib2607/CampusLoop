<?php

namespace App\Services\Messaging;

use App\Models\Message;
use App\Models\MessageAttachment;
use App\Services\Media\CloudinaryService;
use Illuminate\Http\UploadedFile;

class AttachmentService
{
    public function __construct(
        private readonly CloudinaryService $cloudinaryService
    ) {}

    public function upload(Message $message, UploadedFile $file): MessageAttachment
    {
        $result = $this->cloudinaryService->uploadFile($file, 'campusloop/messages');

        return MessageAttachment::create([
            'message_id' => $message->id,
            'file_url'   => $result['url'],
            'public_id'  => $result['public_id'],
            'file_name'  => $file->getClientOriginalName(),
            'file_type'  => $file->getMimeType(),
            'file_size'  => $file->getSize(),
        ]);
    }
}
