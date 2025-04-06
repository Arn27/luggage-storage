<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Booking;

class BookingController extends Controller
{
    public function upcoming()
    {
        return $this->getBookings('upcoming');
    }

    public function past()
    {
        return $this->getBookings('past');
    }

    public function pending()
    {
        return $this->getBookings('pending');
    }

    private function getBookings($type)
    {
        $businessId = Auth::id();

        $query = Booking::with('location')->whereHas('location', function ($q) use ($businessId) {
            $q->where('business_id', $businessId);
        });

        if ($type === 'upcoming') {
            $query->where('date', '>', now()->toDateString());
        } elseif ($type === 'past') {
            $query->where('date', '<=', now()->toDateString());
        } elseif ($type === 'pending') {
            $query->where('status', 'pending');
        }

        return response()->json($query->orderBy('date')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'location_id' => 'required|exists:locations,id',
            'date' => 'required|date',
            'bag_count' => 'required|integer|min:1',
        ]);

        $booking = Booking::create([
            'user_id' => Auth::id(),
            'location_id' => $request->location_id,
            'date' => $request->date,
            'bag_count' => $request->bag_count,
            'status' => 'pending',
        ]);

        return response()->json($booking, 201);
    }

}
