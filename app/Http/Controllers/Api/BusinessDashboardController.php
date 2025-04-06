<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Location;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;

class BusinessDashboardController extends Controller
{
    public function index(Request $request)
    {
        $businessId = Auth::id();

        $locationsCount = Location::where('business_id', $businessId)->count();

        $upcomingBookings = Booking::whereHas('location', function ($query) use ($businessId) {
            $query->where('business_id', $businessId);
        })
        ->whereDate('date', '>', now())
        ->where('status', 'confirmed')
        ->count();

        $pastBookings = Booking::whereHas('location', function ($query) use ($businessId) {
            $query->where('business_id', $businessId);
        })
        ->whereDate('date', '<=', now())
        ->where('status', 'confirmed')
        ->count();

        $pendingBookings = Booking::whereHas('location', function ($query) use ($businessId) {
            $query->where('business_id', $businessId);
        })
        ->where('status', 'pending')
        ->count();

        return response()->json([
            'locations' => $locationsCount,
            'upcomingBookings' => $upcomingBookings,
            'pastBookings' => $pastBookings,
            'pendingBookings' => $pendingBookings,
        ]);
    }
}
