<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureBusinessIsApproved
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();

        if (!$user || !$user->is_approved) {
            return response()->json(['message' => 'Your business account is not approved.'], 403);
        }

        return $next($request);
    }
}
