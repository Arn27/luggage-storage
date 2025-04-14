<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Booking;
use Illuminate\Support\Facades\Storage;

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
        $businessId = auth()->user()->id;

        $bookings = Booking::with(['location', 'user'])
            ->whereHas('location', function ($query) use ($businessId) {
                $query->where('business_id', $businessId);
            })
            ->where('status', 'pending')
            ->get();

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
            'status' => 'pending',
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
        $businessId = auth()->id();
        $bookings = Booking::with(['location', 'user'])
            ->where('status', 'active')
            ->whereHas('location', function ($query) use ($businessId) {
                $query->where('business_id', $businessId);
            })
            ->get();

        return response()->json($bookings);
    }

    public function start($id, Request $request)
    {
        $booking = Booking::with('location')->findOrFail($id);
    
        // Business can only start their own location's bookings
        if ($booking->location->business_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        $booking->start_time = now();
        $booking->status = 'active';
    
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('luggage_photos', 'public');
            $booking->business_luggage_photo = $path;
        }
    
        $booking->save();
    
        return response()->json(['message' => 'Booking started.']);
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

        // Authorization: only the business that owns the location can confirm
        if (auth()->id() !== $booking->location->business_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Save business final photo
        $photoPath = $request->file('photo')->store('booking_photos', 'public');
        $booking->business_close_photo = $photoPath;

        // Set end time
        $booking->end_time = now();

        // Calculate fee based on duration
        if ($booking->start_time && $booking->end_time) {
            $hours = now()->diffInMinutes($booking->start_time) / 60;
            $rate = (float) $booking->location->hourly_rate;
            $fee = round($hours * $rate, 2);
        } else {
            $hours = 0;
            $fee = 0;
        }

        // Finalize booking
        $booking->status = 'completed';
        $booking->save();

        return response()->json([
            'message' => 'Booking closed successfully',
            'duration_hours' => round($hours, 2),
            'estimated_fee' => $fee,
        ]);
    }

}
