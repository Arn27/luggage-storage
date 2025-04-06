<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Business;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Try user login
        if ($user = User::where('email', $request->email)->first()) {
            if (Hash::check($request->password, $user->password)) {
                return response()->json([
                    'token' => $user->createToken('auth_token')->plainTextToken,
                    'user' => $user,
                    'type' => 'user'
                ]);
            }
        }

        // Try business login
        if ($biz = Business::where('email', $request->email)->first()) {
            if (!Hash::check($request->password, $biz->password)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            if (!$biz->is_approved) {
                return response()->json(['message' => 'Business not approved yet'], 403);
            }

            return response()->json([
                'token' => $biz->createToken('auth_token')->plainTextToken,
                'user' => $biz,
                'type' => 'business'
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
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
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
        ]);
    }
}
