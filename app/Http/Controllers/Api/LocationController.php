<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Location;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

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
        $location = Location::with(['reviews.user'])->findOrFail($id);
    
        if (Auth::check()) {
            $location->current_user = Auth::user(); // Only if user is logged in
        }
    
        return response()->json($location);
    }
    
    public function businessLocations()
    {
        $businessId = Auth::id();
        $locations = Location::where('business_id', $businessId)->get();
        return response()->json($locations);
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'max_bags' => 'required|integer|min:1',
            'business_id' => 'required|exists:businesses,id'
        ]);

        $location = Location::create($request->all());
        return response()->json($location, 201);
    }

    public function delete($id)
    {
        $location = Location::findOrFail($id);
        $location->delete();
        return response()->json(['message' => 'Location deleted successfully.']);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $businessProfile = $user->businessProfile;

        if (!$businessProfile) {
            return response()->json(['message' => 'Business profile not found'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string',
            'description' => 'nullable|string',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
            'max_bags' => 'required|integer',
            'hourly_rate' => 'required|numeric',
            'open_hours' => 'required|json',
        ]);

        $location = Location::create([
            'business_id' => $businessProfile->id,
            'qr_token' => Str::uuid(),
            ...$validated
        ]);

        return response()->json($location, 201);
    }

    public function update(Request $request, $id)
    {
        $location = Location::findOrFail($id);

        if ($location->business_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'description' => 'nullable|string',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'max_bags' => 'required|integer|min:1',
            'hourly_rate' => 'required|numeric|min:0',
            'open_hours' => 'nullable|array',
            'open_hours.from' => 'nullable|string',
            'open_hours.to' => 'nullable|string',
        ]);

        $location->update($validated);

        return response()->json(['message' => 'Location updated successfully.']);
    }

    public function destroy($id)
    {
        $location = Location::findOrFail($id);

        if ($location->business_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $location->delete();

        return response()->json(['message' => 'Location deleted.']);
    }
}
