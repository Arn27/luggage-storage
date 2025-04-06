<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Business;
use Illuminate\Support\Facades\Hash;

class BusinessController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'email' => 'required|email|unique:businesses',
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
