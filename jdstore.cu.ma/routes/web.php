<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $indexPath = public_path('index.html');
    if (is_file($indexPath)) {
        return response()->file($indexPath);
    }

    return response()->json(['ok' => true, 'api' => url('/api/estado')]);
});

Route::fallback(function () {
    if (! request()->isMethod('get')) {
        abort(404);
    }

    $indexPath = public_path('index.html');
    if (is_file($indexPath)) {
        return response()->file($indexPath);
    }

    abort(404);
});
