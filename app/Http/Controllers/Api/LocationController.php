<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Location;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\LocationImage;
use Illuminate\Support\Facades\Storage;

class LocationController extends Controller
{
        public function index(Request $request)
        {
            $query = Location::with('images'); // eager load images

            if ($request->has('city')) {
                $query->where('city', 'LIKE', '%' . $request->city . '%');
            }

            if ($request->has('bags')) {
                $query->where('max_bags', '>=', $request->bags);
            }

            return response()->json($query->get());
        }

        public function show($id)
        {
            $location = Location::with(['reviews.user', 'images'])->findOrFail($id);

            // Convert to array to safely add custom fields
            $data = $location->toArray();

            if (Auth::check()) {
                $data['current_user'] = Auth::user();
            }

            return response()->json($data);
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

        return response()->json($location->toArray(), 201);
    }

    public function update(Request $request, $id)
    {
        $location = Location::findOrFail($id);

        if ($location->business_id !== auth()->user()->businessProfile->id) {
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

        if ($location->business_id !== auth()->user()->businessProfile->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $location->delete();

        return response()->json(['message' => 'Location deleted.']);
    }

    public function uploadImages(Request $request, $id)
    {
        $request->validate([
            'images.*' => 'required|image|max:5120', // max 5MB each
        ]);

        $location = Location::findOrFail($id);

        if ($location->images()->count() + count($request->file('images')) > 5) {
            return response()->json(['message' => 'Maximum 5 images allowed.'], 400);
        }

        foreach ($request->file('images', []) as $image) {
            $path = $image->store('location_images', 'public');
            LocationImage::create([
                'location_id' => $location->id,
                'path' => $path,
            ]);
        }

        return response()->json(['message' => 'Images uploaded successfully.'], 200);
    }

    public function deleteImage($id)
    {
        $image = LocationImage::findOrFail($id);
        Storage::disk('public')->delete($image->path);
        $image->delete();

        return response()->json(['message' => 'Image deleted.']);
    }


}
