<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Location;

class LocationController extends Controller
{
    public function index(Request $request)
    {
        $query = Location::query();

        if ($request->has('city')) {
            $query->where('city', $request->city);
        }

        if ($request->has('bags')) {
            $query->where('max_bags', '>=', $request->bags);
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        $location = \App\Models\Location::with(['reviews.user'])->findOrFail($id);
        return response()->json($location);
    }

}
