<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureBusinessIsApproved
{
    public function handle($request, Closure $next)
    {
        $user = $request->user();
    
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 403);
        }
    
        $user->loadMissing('roles'); // 🔑 Ensure roles are loaded
    
        if (!$user->hasRole('business')) {
            return response()->json(['message' => 'User is not a business'], 403);
        }
    
        if (!$user->businessProfile || !$user->businessProfile->is_approved) {
            return response()->json(['message' => 'Business not approved'], 403);
        }
    
        return $next($request);
    }   
}
