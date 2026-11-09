<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;


// Fallback público para instalações em que `php artisan storage:link` ainda não foi executado.
// O caminho é limitado ao diretório de fotos de perfil.
Route::get('/storage/{path}', function (string $path) {
    $path = ltrim($path, '/');
    abort_unless(str_starts_with($path, 'profile-photos/') && Storage::disk('public')->exists($path), 404);
    return response()->file(Storage::disk('public')->path($path));
})->where('path', 'profile-photos/.*');

Route::get('/', function () {
    return view('welcome');
});
