<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class UserController extends Controller
{
    public function getUserById(Request $request)
    {
        return response()->json($request->id);
        $getUser = User::where('id', $request->user_id)->get();

        if ($getUser->count() > 0) {
            return response()->json([
                'status' => true,
                'user' => $getUser
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'User Not Found',
            ], 401);
        }
    }

    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user, 200);
    }

    // public function updateUser(Request $request){
    //     // return response()->json($request->name);
    //     $validateUser = Validator::make($request->all(),[
    //         'name' => 'required|max:50',
    //         'email' => 'required|email|unique:users,email',
    //         // 'password' => 'required'
    //     ]);
    //     if($validateUser->fails()){
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'Please enter required field',
    //             'errors' => $validateUser->errors()->all()
    //         ],401);
    //     }

    //     $getUser = User::where('id', $request->user_id)->get();
    //     if($getUser->count() > 0){
    //         User::where('id', $request->user_id)->update([
    //             "name" => $request->name,
    //             "email" => $request->email ?? null,
    //             "password" => $request->password ?? null,
    //         ]);

    //         return response()->json([
    //             'status' => true,
    //             'message' => 'User profile updated Successfully',
    //         ],200);
    //     }else{
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'User Not Found',
    //         ],401);
    //     }
    // }

    // public function updateUser(Request $request, $id)
    // {
    //     // Validate input
    //     $validateUser = Validator::make($request->all(), [
    //         'name' => 'required|max:50',
    //     ]);

    //     if ($validateUser->fails()) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'Validation failed',
    //             'errors' => $validateUser->errors()->all(),
    //         ], 400);
    //     }

    //     // Fetch the user by ID
    //     $user = User::find($id);

    //     if (!$user) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'User not found',
    //         ], 404);
    //     }

    //     // Update only the name field
    //     $user->update([
    //         'name' => $request->name,
    //     ]);

    //     return response()->json([
    //         'status' => true,
    //         'message' => 'User name updated successfully',
    //         'user' => $user, // Optional: Return updated user data
    //     ], 200);
    // }




    
    public function updateUser(Request $request, $id)
    {
        // Validate the input
        $validateUser = Validator::make($request->all(), [
            'name' => 'required|string|max:50',
            'email' => 'required|email|max:100|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6', // Password is optional
        ]);
    
        if ($validateUser->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validateUser->errors()->all(),
            ], 400);
        }
    
        // Find the user by ID
        $user = User::find($id);
    
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found',
            ], 404);
        }
    
        // Update user details
        $user->name = $request->name;
        $user->email = $request->email;
    
        // Only update the password if provided
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
    
        // Save updated user details
        $user->save();
    
        return response()->json([
            'status' => true,
            'message' => 'Profile updated successfully',
            'user' => $user, // Optionally return the updated user data
        ], 200);
    }
    
}
