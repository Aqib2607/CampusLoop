<?php

namespace App\Services\Media;

use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use RuntimeException;

class CloudinaryService
{
    private readonly Cloudinary $cloudinary;

    public function __construct()
    {
        $this->cloudinary = new Cloudinary(
            Configuration::instance([
                'cloud' => [
                    'cloud_name' => config('cloudinary.cloud_name'),
                    'api_key'    => config('cloudinary.api_key'),
                    'api_secret' => config('cloudinary.api_secret'),
                ],
                'url' => [
                    'secure' => true,
                ],
            ])
        );
    }

    /**
     * Upload an image file to Cloudinary.
     */
    public function uploadImage(UploadedFile $file, string $folder = 'campusloop'): array
    {
        $this->validateImage($file);

        try {
            $result = $this->cloudinary->uploadApi()->upload(
                $file->getRealPath(),
                [
                    'folder'         => $folder,
                    'public_id'      => Str::uuid()->toString(),
                    'resource_type'  => 'image',
                    'transformation' => [
                        'quality' => 'auto',
                        'fetch_format' => 'auto',
                    ],
                ]
            );

            return [
                'url'       => $result['secure_url'],
                'public_id' => $result['public_id'],
                'width'     => $result['width'],
                'height'    => $result['height'],
                'format'    => $result['format'],
            ];
        } catch (\Exception $e) {
            throw new RuntimeException('Image upload failed: ' . $e->getMessage());
        }
    }

    /**
     * Upload any file (PDF, doc, voice, etc.) to Cloudinary.
     */
    public function uploadFile(UploadedFile $file, string $folder = 'campusloop/attachments'): array
    {
        try {
            $result = $this->cloudinary->uploadApi()->upload(
                $file->getRealPath(),
                [
                    'folder'        => $folder,
                    'public_id'     => Str::uuid()->toString(),
                    'resource_type' => 'auto',
                    'use_filename'  => false,
                ]
            );

            return [
                'url'       => $result['secure_url'],
                'public_id' => $result['public_id'],
                'bytes'     => $result['bytes'],
                'format'    => $result['format'] ?? null,
            ];
        } catch (\Exception $e) {
            throw new RuntimeException('File upload failed: ' . $e->getMessage());
        }
    }

    /**
     * Delete a file from Cloudinary by public_id.
     */
    public function delete(string $publicId, string $resourceType = 'image'): bool
    {
        try {
            $result = $this->cloudinary->uploadApi()->destroy($publicId, [
                'resource_type' => $resourceType,
            ]);

            return $result['result'] === 'ok';
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Validate image file type and size (jpg/png/webp, max 20MB).
     */
    private function validateImage(UploadedFile $file): void
    {
        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        $maxSize      = 20 * 1024 * 1024; // 20 MB in bytes

        if (! in_array($file->getMimeType(), $allowedMimes)) {
            throw new RuntimeException('Invalid file type. Allowed: jpg, png, webp.');
        }

        if ($file->getSize() > $maxSize) {
            throw new RuntimeException('File size exceeds 20MB limit.');
        }
    }
}
