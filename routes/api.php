<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\BusinessController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\BusinessDashboardController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ReviewController;

Route::get('/locations', [LocationController::class, 'index']);

Route::get('/locations/{id}', [LocationController::class, 'show']);

Route::post('/login', [AuthController::class, 'login']);

Route::post('/register', [AuthController::class, 'register']);

Route::post('/register/business', [BusinessController::class, 'register']);

Route::prefix('business')->middleware(['auth:sanctum', 'approved.business'])->group(function () {
    Route::get('/dashboard', [BusinessDashboardController::class, 'index']);
    Route::get('/locations', [LocationController::class, 'businessLocations']);
    
    // ✅ Use unique prefix to avoid conflict
    Route::put('/locations/{id}', [LocationController::class, 'update']);
    Route::delete('/locations/{id}', [LocationController::class, 'destroy']);

    Route::get('/bookings/upcoming', [BookingController::class, 'upcoming']);
    Route::get('/bookings/past', [BookingController::class, 'past']);
    Route::get('/bookings/pending', [BookingController::class, 'pending']);
});

Route::middleware('auth:sanctum')->post('/bookings', [BookingController::class, 'store']);
Route::middleware('auth:sanctum')->get('/user/bookings', [BookingController::class, 'userBookings']);
Route::middleware('auth:sanctum')->delete('/bookings/{id}', [BookingController::class, 'destroy']);
Route::middleware('auth:sanctum')->post('/reviews', [ReviewController::class, 'store']);



Route::middleware(['auth:sanctum', 'approved.business'])->post('/locations', [LocationController::class, 'store']);

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/pending-businesses', [AdminController::class, 'pendingBusinesses']);
    Route::post('/approve-business/{id}', [AdminController::class, 'approveBusiness']);
});
