<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index(Request $request)
    {
        $query = \App\Models\Location::query();

        if ($request->has('city')) {
            $query->where('city', $request->city);
        }

        if ($request->has('bags')) {
            $query->where('max_bags', '>=', $request->bags);
        }

        return $query->get();
    }
}
