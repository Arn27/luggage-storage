<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class CustomAuthenticate extends Middleware
{
    protected function redirectTo($request)
    {
        // Prevent redirect for API requests → return 401 JSON instead
        if (! $request->expectsJson()) {
            return null;
        }
    }
}
