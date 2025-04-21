<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureBusinessIsApproved
{
    public function handle($request, Closure $next)
    {
        $user = $request->user();
    
        if (!$user || !$user->hasRole('business')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        if (!$user->businessProfile || !$user->businessProfile->is_approved) {
            return response()->json(['message' => 'Business not approved'], 403);
        }
    
        return $next($request);
    }    
}
