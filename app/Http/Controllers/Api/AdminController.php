<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;

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
}
