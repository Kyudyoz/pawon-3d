<?php

use App\Http\Controllers\MaterialController;
use App\Http\Controllers\ProcessedMaterialController;
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

    Route::get('/inventori/olahan-bahan-baku', [ProcessedMaterialController::class, 'index'])->name('processed-material.index');
    Route::post('/inventori/olahan-bahan-baku', [ProcessedMaterialController::class, 'store'])->name('processed-material.store');
    Route::put('/inventori/olahan-bahan-baku/{processedMaterial}', [ProcessedMaterialController::class, 'update'])->name('processed-material.update');
    Route::delete('/inventori/olahan-bahan-baku/{processedMaterial}', [ProcessedMaterialController::class, 'destroy'])->name('processed-material.destroy');

    Route::get('/produk', [ProductController::class, 'index'])->name('product.index');
    Route::post('/produk', [ProductController::class, 'store'])->name('product.store');
    Route::post('/produk/{product}', [ProductController::class, 'update'])->name('product.update');
    Route::delete('/produk/{product}', [ProductController::class, 'destroy'])->name('product.destroy');
});

require __DIR__ . '/auth.php';