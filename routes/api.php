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

// --------------------
// Public Routes
// --------------------

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/register/business', [BusinessController::class, 'register']);

Route::get('/locations', [LocationController::class, 'index']);
Route::get('/locations/{id}', [LocationController::class, 'show']); // visible to everyone

// --------------------
// Authenticated User Routes
// --------------------

Route::middleware('auth:sanctum')->group(function () {
    // Bookings
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/user/bookings', [BookingController::class, 'userBookings']);
    Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

    // Business-only routes (approved only)
    Route::middleware('approved.business')->prefix('business')->group(function () {
        Route::get('/dashboard', [BusinessDashboardController::class, 'index']);
        Route::get('/locations', [LocationController::class, 'businessLocations']);
        Route::post('/locations', [LocationController::class, 'store']);
        Route::put('/locations/{id}', [LocationController::class, 'update']);
        Route::delete('/locations/{id}', [LocationController::class, 'destroy']);
        Route::post('/bookings/{id}/confirm', [BookingController::class, 'confirm']);


        // Bookings management
        Route::get('/bookings/upcoming', [BookingController::class, 'upcoming']);
        Route::get('/bookings/past', [BookingController::class, 'past']);
        Route::get('/bookings/pending', [BookingController::class, 'pending']);
    });

    // Admin-only routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        // Business approval
        Route::get('/pending-businesses', [AdminController::class, 'pendingBusinesses']);
        Route::post('/approve-business/{id}', [AdminController::class, 'approveBusiness']);

        // Manage users & businesses
        Route::get('/users', [AdminController::class, 'getAllUsers']);
        Route::get('/businesses', [AdminController::class, 'getAllBusinesses']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::delete('/businesses/{id}', [AdminController::class, 'deleteBusiness']);

        // Manage locations
        Route::get('/locations', [AdminController::class, 'getAllLocations']);
        Route::delete('/locations/{id}', [AdminController::class, 'deleteLocation']);
    });
});
