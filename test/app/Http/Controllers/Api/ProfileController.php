<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ProfileController extends Controller
{
    // Get Profile
    public function getProfile($userId)
    {
        return response()->json($userId);
        $user = User::findOrFail($userId);
        $profile = $user->profile; // Fetch the user's profile

        return response()->json([
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'profile' => $profile,
        ]);
    }

    // Update Profile
    public function updateProfile(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        $profile = $user->profile; // Fetch the existing profile

        // Validate the request data
        $validatedData = $request->validate([
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'email' => 'email|max:255',
            'contact_info' => 'nullable|string|max:255',
            'current_address' => 'nullable|string|max:255',
            'permanent_address' => 'nullable|string|max:255',
            'employment_details' => 'nullable|string',
        ]);

        // Update user and profile
        $user->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
        ]);

        $profile->update($validatedData);

        return response()->json(['message' => 'Profile updated successfully']);
    }
}
