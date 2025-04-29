<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BusinessProfile;
use App\Models\Location;
use App\Models\User;
use App\Models\Business;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function pendingBusinesses()
    {
        return BusinessProfile::where('is_approved', false)->get();
    }

    public function approveBusiness($id)
    {
        $business = BusinessProfile::findOrFail($id);
        $business->is_approved = true;
        $business->save();

        return response()->json(['message' => 'Business approved successfully']);
    }

    public function getAllUsers()
    {
        return response()->json(User::with('roles')->get());
    }

    public function getAllBusinesses()
    {
        return response()->json(
            BusinessProfile::with('users.roles')->get()
        );
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
        $business = BusinessProfile::find($id);

        if (!$business) {
            return response()->json(['message' => 'Business not found'], 404);
        }

        $business->delete();
        return response()->json(['message' => 'Business deleted successfully']);
    }

    public function getAllLocations()
    {
        return response()->json(
            Location::with('business')->get()
        );
    }

    public function adminStats()
    {
        $usersCount = User::count();
        $businessesCount = BusinessProfile::count();
        $locationsCount = Location::count();
        $pendingBusinessesCount = BusinessProfile::where('is_approved', false)->count();
    
        return response()->json([
            'users' => $usersCount,
            'businesses' => $businessesCount,
            'locations' => $locationsCount,
            'pendingBusinesses' => $pendingBusinessesCount,
        ]);
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
