<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;

class UserDashboardController extends Controller
{
    public function bookings(Request $request)
    {
        $user = $request->user();

        $bookings = Booking::with('location')
            ->where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($bookings);
    }
}
