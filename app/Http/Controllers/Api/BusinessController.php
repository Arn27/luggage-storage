<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\BusinessProfile;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Booking;


class BusinessController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:20',
            'name' => 'required|string|max:255',
        ]);
    
        DB::beginTransaction();
    
        try {
            // 1. Create business profile
            $business = BusinessProfile::create([
                'name' => $validated['business_name'],
                'phone' => $validated['phone'],
                'is_approved' => false, // admin must approve
            ]);
    
            // 2. Create user and assign business_id
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'business_id' => $business->id,
            ]);
    
            // 3. Assign business role
            $role = Role::where('name', 'business')->first();
            $user->roles()->attach($role);
    
            DB::commit();
    
            return response()->json([
                'message' => 'Business registered. Awaiting admin approval.',
                'user' => $user,
            ], 201);
    
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Registration failed.'], 500);
        }
    }
    
}
