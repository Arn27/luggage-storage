<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\BusinessController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\BusinessDashboardController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ReviewController;

// Public Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/register/business', [BusinessController::class, 'register']);

Route::get('/locations', [LocationController::class, 'index']);
Route::get('/locations/{id}', [LocationController::class, 'show']);

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {

    // Bookings
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/active', [BookingController::class, 'activeBookings']);
    Route::post('/bookings/{id}/cancel', [BookingController::class, 'cancel']);

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Business Dashboard (only approved businesses)
    Route::middleware(['ensure.business.approved'])->group(function () {
        Route::get('/dashboard/business', [BusinessDashboardController::class, 'index']);
    });

    // Admin Panel
    Route::middleware(['is.admin'])->group(function () {
        Route::get('/admin/pending-businesses', [AdminController::class, 'pendingBusinesses']);
        Route::post('/admin/approve-business/{id}', [AdminController::class, 'approveBusiness']);

        Route::get('/admin/users', [AdminController::class, 'getAllUsers']);
        Route::delete('/admin/user/{id}', [AdminController::class, 'deleteUser']);

        Route::get('/admin/businesses', [AdminController::class, 'getAllBusinesses']);
        Route::delete('/admin/business/{id}', [AdminController::class, 'deleteBusiness']);

        Route::get('/admin/locations', [AdminController::class, 'getAllLocations']);
        Route::delete('/admin/location/{id}', [AdminController::class, 'deleteLocation']);
    });

    // Location management (for businesses)
    Route::post('/locations', [LocationController::class, 'store']);
    Route::put('/locations/{id}', [LocationController::class, 'update']);
    Route::delete('/locations/{id}', [LocationController::class, 'destroy']);
});
