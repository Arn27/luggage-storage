<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\BusinessController;

Route::get('/test', function () {
    return response()->json(['message' => 'API veikia!']);
});

Route::get('/locations', [LocationController::class, 'index']);

Route::get('/locations/{id}', [LocationController::class, 'show']);

Route::post('/login', [AuthController::class, 'login']);

Route::post('/register', [AuthController::class, 'register']);

Route::post('/register/business', [BusinessController::class, 'register']);

Route::middleware(['auth:sanctum', 'approved.business'])->get('/business/dashboard', function () {
    return response()->json(['message' => 'Welcome, approved business!']);
});
