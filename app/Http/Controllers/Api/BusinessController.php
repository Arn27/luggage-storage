<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\BusinessProfile;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class BusinessController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'email' => [
                'required', 'email', 'unique:users,email'
            ],
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:20',
            'name' => 'required|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            $profile = BusinessProfile::create([
                'name' => $validated['business_name'],
                'phone' => $validated['phone'] ?? null,
                'is_approved' => false,
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'business_id' => $profile->id,
            ]);

            $businessRole = Role::where('name', 'business')->first();
            $user->roles()->attach($businessRole);

            DB::commit();

            return response()->json([
                'message' => 'Business registered. Awaiting admin approval.',
                'user' => $user,
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['error' => 'Registration failed.'], 500);
        }
    }
}
