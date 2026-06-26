<?php

use Illuminate\Support\Facades\Route;

// Serve the React app for all non-API routes
Route::get('/{any}', function () {
    $path = public_path('build/index.html');
    if (!file_exists($path)) {
        return "Frontend build not found. Please run 'npm run build' in the root directory.";
    }
    return file_get_contents($path);
})->where('any', '^(?!api).*$');
