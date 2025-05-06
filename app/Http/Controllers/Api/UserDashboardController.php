<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

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

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password updated successfully.']);
    }
}
