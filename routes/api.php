<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\BusinessController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\BusinessDashboardController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\UserDashboardController;

// -------------------------
// Public Routes
// -------------------------
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/register/business', [BusinessController::class, 'register']);

Route::get('/locations', [LocationController::class, 'index']);
Route::get('/locations/{id}', [LocationController::class, 'show']);

// -------------------------
// Authenticated Routes
// -------------------------
Route::middleware('auth:sanctum')->group(function () {

    // Booking - Traveler
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/active', [BookingController::class, 'activeBookings']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::post('/bookings/{id}/cancel', [BookingController::class, 'cancel']);
    Route::post('/bookings/{id}/user-start', [BookingController::class, 'userStart']);
    Route::post('/bookings/{id}/business-start', [BookingController::class, 'businessStart']);
    Route::post('/bookings/{id}/stop', [BookingController::class, 'userStop']); // User ends booking
    Route::post('/qr-checkin/{qr_token}', [BookingController::class, 'qrCheckIn']);

    // Traveler Dashboard
    Route::get('/user/bookings', [UserDashboardController::class, 'bookings']);
    Route::post('/user/change-password', [UserDashboardController::class, 'changePassword']);
    Route::get('/user/booking/active', [BookingController::class, 'activeUserBooking']);
    Route::get('/user/bookings/{id}', [BookingController::class, 'userBookingDetail']);


    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Business Routes (Approved Only)
    Route::middleware(['approved.business'])->group(function () {
        Route::get('/dashboard/business', [BusinessDashboardController::class, 'index']);
        Route::get('/business/locations', [BusinessDashboardController::class, 'locations']);
        Route::get('/business/bookings/active', [BookingController::class, 'active']);
        Route::get('/business/bookings/pending', [BookingController::class, 'businessPendingBookings']);
        Route::get('/business/bookings/upcoming', [BookingController::class, 'businessUpcomingBookings']);
        Route::get('/business/bookings/past', [BookingController::class, 'businessPastBookings']);
        Route::post('/business/bookings/{id}/stop', [BookingController::class, 'businessStop']); // Business ends booking
    });

    // Admin Routes
    Route::middleware(['is.admin'])->group(function () {
        Route::get('/admin/stats', [AdminController::class, 'adminStats']);
        Route::get('/admin/pending-businesses', [AdminController::class, 'pendingBusinesses']);
        Route::post('/admin/approve-business/{id}', [AdminController::class, 'approveBusiness']);

        Route::get('/admin/users', [AdminController::class, 'getAllUsers']);
        Route::delete('/admin/user/{id}', [AdminController::class, 'deleteUser']);

        Route::get('/admin/businesses', [AdminController::class, 'getAllBusinesses']);
        Route::delete('/admin/business/{id}', [AdminController::class, 'deleteBusiness']);

        Route::get('/admin/locations', [AdminController::class, 'getAllLocations']);
        Route::delete('/admin/location/{id}', [AdminController::class, 'deleteLocation']);
    });

    // Location Management (Business)
    Route::post('/locations', [LocationController::class, 'store']);
    Route::put('/locations/{id}', [LocationController::class, 'update']);
    Route::delete('/locations/{id}', [LocationController::class, 'destroy']);
});
