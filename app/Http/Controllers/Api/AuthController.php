<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Block login for unapproved businesses
        if (
            $user->hasRole('business') &&
            optional($user->businessProfile)->is_approved === false
        ) {
            return response()->json(['message' => 'Business not approved yet'], 403);
        }

        return response()->json([
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user->only(['id', 'name', 'email', 'created_at']),
            'roles' => $user->roles->pluck('name')
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $role = Role::where('name', 'traveller')->first();
        if ($role) {
            $user->roles()->attach($role);
        }

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user->only(['id', 'name', 'email', 'created_at']),
            'roles' => $user->roles->pluck('name')
        ]);
    }
}
