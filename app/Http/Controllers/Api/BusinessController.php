<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Business;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class BusinessController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'email' => [
                'required', 'email',
                function ($attribute, $value, $fail) {
                    $existsInUsers = DB::table('users')->where('email', $value)->exists();
                    $existsInBusinesses = DB::table('businesses')->where('email', $value)->exists();
                    if ($existsInUsers || $existsInBusinesses) {
                        $fail('This email is already taken.');
                    }
                }
            ],
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:20',
        ]);

        $business = Business::create([
            'business_name' => $validated['business_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'is_approved' => false,
        ]);

        return response()->json([
            'message' => 'Business registered. Awaiting admin approval.',
            'business' => $business,
        ]);
    }
}
