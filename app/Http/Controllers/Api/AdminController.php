<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Location;
use App\Models\User;

class AdminController extends Controller
{
    public function pendingBusinesses()
    {
        return Business::where('is_approved', false)->get();
    }

    public function approveBusiness($id)
    {
        $business = Business::findOrFail($id);
        $business->is_approved = true;
        $business->save();

        return response()->json(['message' => 'Business approved successfully.']);
    }

    public function getAllUsers()
    {
        $users = User::all();
        \Log::info("getAllUsers() called");

        return response()->json($users);
    }

    public function getAllBusinesses()
    {
        $businesses = Business::all();
        return response()->json($businesses);
    }

    public function deleteUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function deleteBusiness($id)
    {
        $business = Business::find($id);
        if (!$business) {
            return response()->json(['message' => 'Business not found'], 404);
        }

        $business->delete();
        return response()->json(['message' => 'Business deleted successfully']);
    }

    public function getAllLocations()
    {
        $locations = Location::with('business')->get();
        return response()->json($locations);
    }

    public function deleteLocation($id)
    {
        $location = Location::find($id);
        if (!$location) {
            return response()->json(['message' => 'Location not found'], 404);
        }

        $location->delete();
        return response()->json(['message' => 'Location deleted successfully']);
    }

}
