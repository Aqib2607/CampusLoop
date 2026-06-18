<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cloudinary Configuration
    |--------------------------------------------------------------------------
    */

    'cloud_name' => env('CLOUDINARY_CLOUD_NAME', ''),
    'api_key'    => env('CLOUDINARY_API_KEY', ''),
    'api_secret' => env('CLOUDINARY_API_SECRET', ''),
    'secure'     => true,

    /*
    | Upload defaults
    */
    'upload' => [
        'max_image_size' => 20 * 1024 * 1024, // 20 MB
        'allowed_mimes'  => ['image/jpeg', 'image/png', 'image/webp'],
        'folders'        => [
            'avatars'     => 'campusloop/avatars',
            'listings'    => 'campusloop/listings',
            'messages'    => 'campusloop/messages',
            'attachments' => 'campusloop/attachments',
        ],
    ],
];
