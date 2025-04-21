<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    public function handle($request, Closure $next)
    {
        $user = $request->user();
    
        if (!$user || !$user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        return $next($request);
    }    
}
