<?php

use App\Http\Controllers\OAuth\Connect\Google as AuthorizeGoogle;
use App\Http\Controllers\Session\StoreController as StoreSession;
use App\Http\Controllers\User\StoreController as StoreUser;
use Illuminate\Support\Facades\Route;

Route::view('login', 'session.create')->name('login');
Route::post('login', StoreSession::class)->name('session.store');
Route::view('register','user.create')->name('register');
Route::post('register', StoreUser::class)->name('user.store');

Route::middleware('auth')->group(function () {
    Route::inertia('/', 'dashboard')->name('dashboard');
    Route::inertia('/settings', 'dashboard')->name('settings');

    Route::get('oauth/connect/google', AuthorizeGoogle::class);
});
