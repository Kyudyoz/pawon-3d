<?php

use App\Http\Controllers\MaterialController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/user', [UserController::class, 'index'])->name('user.index');
    Route::post('/user', [UserController::class, 'store'])->name('user.store');
    Route::put('/user/{user}', [UserController::class, 'update'])->name('user.update');
    Route::delete('/user/{user}', [UserController::class, 'destroy'])->name('user.destroy');

    Route::get('/inventori/bahan-baku', [MaterialController::class, 'index'])->name('material.index');
    Route::post('/inventori/bahan-baku', [MaterialController::class, 'store'])->name('material.store');
    Route::put('/inventori/bahan-baku/{material}', [MaterialController::class, 'update'])->name('material.update');
    Route::delete('/inventori/bahan-baku/{material}', [MaterialController::class, 'destroy'])->name('material.destroy');

    Route::get('/produk', [ProductController::class, 'index'])->name('product.index');
});

require __DIR__ . '/auth.php';
