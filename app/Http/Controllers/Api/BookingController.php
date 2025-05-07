<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Booking;
use App\Models\Location;

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
        $businessId = auth()->user()->business_id;

        \Log::info("Business ID: " . $businessId);

        $bookings = Booking::with(['location', 'user'])
            ->whereHas('location', function ($query) use ($businessId) {
                $query->where('business_id', $businessId);
            })
            ->whereIn('status', ['pending_start', 'user_started'])
            ->get();

        \Log::info("Found " . $bookings->count() . " pending bookings.");

        return response()->json($bookings);
    }

    private function getBookings($type)
    {
        $businessId = Auth::id();

        $query = Booking::with(['location', 'user'])
            ->whereHas('location', function ($q) use ($businessId) {
                $q->where('business_id', $businessId);
            });

        if ($type === 'upcoming') {
            $query->where('date', '>', now()->toDateString())->where('status', 'confirmed');
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
            'status' => 'pending_start',
        ]);

        return response()->json($booking, 201);
    }

    public function userBookings(Request $request)
    {
        $user = $request->user();
        $bookings = $user->bookings()->with('location')->orderBy('date', 'desc')->get();
        return response()->json($bookings);
    }

    public function destroy($id)
    {
        $booking = Booking::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        $booking->delete();
        return response()->json(['message' => 'Booking cancelled']);
    }

    public function confirm($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->status = 'confirmed';
        $booking->save();

        return response()->json(['message' => 'Booking confirmed successfully']);
    }

    public function active()
    {
        $businessId = auth()->user()->business_id;
        $bookings = Booking::with(['location', 'user'])
            ->where('status', 'active')
            ->whereHas('location', function ($query) use ($businessId) {
                $query->where('business_id', $businessId);
            })
            ->get();

        return response()->json($bookings);
    }

    public function uploadPhoto(Request $request, $id)
    {
        $request->validate([
            'photo' => 'required|image|max:5120'
        ]);

        $booking = Booking::findOrFail($id);
        $path = $request->file('photo')->store('booking_photos', 'public');
        $booking->photos = array_merge($booking->photos ?? [], [$path]);
        $booking->save();

        return response()->json(['message' => 'Photo uploaded']);
    }

    public function initiateClose($id, Request $request)
    {
        $booking = Booking::findOrFail($id);

        if ($booking->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $booking->status = 'closing_requested';

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('luggage_photos', 'public');
            $booking->user_close_photo = $path;
        }

        $booking->save();

        return response()->json(['message' => 'Closure requested.']);
    }

    public function confirmClose(Request $request, $id)
    {
        $request->validate([
            'photo' => 'required|image|max:2048',
        ]);

        $booking = Booking::with('location')->findOrFail($id);

        if (auth()->id() !== $booking->location->business_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $photoPath = $request->file('photo')->store('booking_photos', 'public');
        $booking->business_close_photo = $photoPath;

        $booking->ended_at = now();

        if ($booking->start_time && $booking->end_time) {
            $hours = now()->diffInMinutes($booking->start_time) / 60;
            $rate = (float) $booking->location->hourly_rate;
            $fee = round($hours * $rate, 2);
        } else {
            $hours = 0;
            $fee = 0;
        }

        $booking->status = 'completed';
        $booking->save();

        return response()->json([
            'message' => 'Booking closed successfully',
            'duration_hours' => round($hours, 2),
            'estimated_fee' => $fee,
        ]);
    }

    public function userStart(Request $request, $id)
    {
        $request->validate([
            'photo' => 'required|image|max:5120',
        ]);

        $booking = Booking::with('user')->findOrFail($id);

        if ($booking->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if (!in_array($booking->status, ['pending_start', 'business_started'])) {
            return response()->json(['message' => 'Invalid booking state.'], 400);
        }

        $path = $request->file('photo')->store('booking_photos', 'public');
        $booking->user_start_photo = $path;

        if ($booking->business_start_photo) {
            $booking->status = 'active';
            $booking->started_at = now();
        } else {
            $booking->status = 'user_started';
        }

        $booking->save();

        return response()->json(['message' => 'Start photo uploaded successfully.']);
    }

    

    public function show($id)
    {
        $booking = Booking::with('location')->findOrFail($id);

        if ($booking->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($booking);
    }

    public function activeUserBooking(Request $request)
    {
        $userId = $request->user()->id;
    
        $booking = Booking::with('location')
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->latest()
            ->first();
    
        return response()->json($booking);
    }
    

    public function businessStart(Request $request, $id)
    {
        $request->validate([
            'photo' => 'required|image|max:5120',
        ]);

        $booking = Booking::with('location')->findOrFail($id);

        if ($booking->location->business_id !== optional(auth()->user()->businessProfile)->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!in_array($booking->status, ['pending_start', 'user_started'])) {
            return response()->json(['message' => 'Invalid booking state.'], 400);
        }

        $path = $request->file('photo')->store('booking_photos', 'public');
        $booking->business_start_photo = $path;

        if ($booking->user_start_photo) {
            $booking->status = 'active';
            $booking->started_at = now();
        } else {
            $booking->status = 'business_started';
        }

        $booking->save();

        return response()->json(['message' => 'Business confirmed booking start.']);
    }
    
}
