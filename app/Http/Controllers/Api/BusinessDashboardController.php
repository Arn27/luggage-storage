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
            $user = Auth::user();

            if (!$user || !$user->businessProfile) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $business = $user->businessProfile;

            $locations = $business->locations()->count();

            $bookings = $business->locations()->with('bookings')->get()->flatMap(function ($location) {
                return $location->bookings;
            });

            $stats = [
                'locations' => $locations,
                'upcomingBookings' => $bookings
                    ->where('status', 'pending_start')
                    ->count(),
                'pendingBookings' => $bookings
                    ->whereIn('status', ['user_started', 'business_started'])
                    ->count(),
                'activeBookings' => $bookings
                    ->whereIn('status', ['active', 'pending_end'])
                    ->count(),
                'pastBookings' => $bookings
                    ->whereIn('status', ['completed', 'declined', 'cancelled'])
                    ->count(),
            ];

            return response()->json($stats);
        }

    public function locations()
    {
        $businessId = auth()->user()?->business_id;
    
        if (!$businessId) {
            return response()->json(['message' => 'Business not found.'], 404);
        }
    
        $locations = Location::where('business_id', $businessId)->get();
    
        return response()->json($locations);
    }
    
}