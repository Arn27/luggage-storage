<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();

        $hasBooking = Booking::where('user_id', $user->id)
            ->where('location_id', $validated['location_id'])
            ->where('date', '<', now())
            ->exists();

        if (!$hasBooking) {
            return response()->json(['message' => 'You must book this location before leaving a review.'], 403);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'location_id' => $validated['location_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? '',
        ]);

        return response()->json($review, 201);
    }
}
