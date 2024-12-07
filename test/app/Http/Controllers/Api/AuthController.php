<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\Email;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;
use GuzzleHttp\Exception\ClientException;
use PhpParser\Node\Stmt\TryCatch;

class AuthController extends Controller
{

    // public function signUp(Request $request)
    // {
    //     // return response()->json("hello");
    //     $validateUser = Validator::make($request->all(), [
    //         'name' => 'required|max:50',
    //         'email' => 'required|email|unique:users,email',
    //         'password' => 'required'
    //     ]);

    //     if ($validateUser->fails()) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'Validation Error',
    //             'errors' => $validateUser->errors()
    //         ], 422);
    //     }

    //     $subject = 'Registration OTP';
    //     $email = $request->email;
    //     $otp = rand(100000, 999999);

    //     $user = User::create([
    //         'name' => $request->name,
    //         'email' => $email,
    //         'password' => Hash::make($request->password),
    //         'email_otp' => $otp,
    //         'created_at' => now(),
    //         'updated_at' => now()
    //     ]);

    //     try {
    //         self::sendMail($email, $subject, $otp);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'Error sending email: ' . $e->getMessage()
    //         ], 500);
    //     }

    //     return response()->json([
    //         'status' => true,
    //         'user' => $user,
    //         'otp' => $otp,
    //         'message' => 'We have sent the OTP to your email. Please check your email and verify.'
    //     ], 200);
    // }

    public function signUp(Request $request)
    {
        // return response()->json($request);
        // Validate the input data
        $validateUser = Validator::make($request->all(), [
            'first_name' => 'required|max:50',
            'last_name' => 'required|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => 'required'
        ]);

        // If validation fails, return the errors
        if ($validateUser->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validateUser->errors()
            ], 422);
        }

        // OTP and email subject
        $subject = 'Registration OTP';
        $email = $request->email;
        $otp = rand(100000, 999999);

        // Create a new user
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $email,
            'password' => Hash::make($request->password),
            'email_otp' => $otp,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Send OTP email
        try {
            self::sendMail($email, $subject, $otp);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error sending email: ' . $e->getMessage()
            ], 500);
        }

        // Return success response
        return response()->json([
            'status' => true,
            'user' => $user,
            'otp' => $otp,
            'message' => 'We have sent the OTP to your email. Please check your email and verify.'
        ], 200);
    }



    public function verifyOtpWithReg(Request $request)
    {
        $user_id = (int) isset($request->user_id) ? (int)$request->user_id : null;
        $getOtp = isset($request->email_otp) ? (int)$request->email_otp : null;
        $user = User::where('id', $user_id)->first();
        // return response()->json($user);

        if ($user && $getOtp !== (int) $user->email_otp) {
            return response()->json([
                'status' => false,
                'message' => 'The OTP you entered is incorrect. Please check your email and try again.'
            ], 401);
        }

        if ($user->count() > 0) {
            $user = User::where('id', $user_id)->update([
                'status' => 1,
                'email_verified_at' => now(),
                'email_otp' => null,
                'updated_at' => now()
            ]);

            return response()->json([
                'status' => true,
                'message' => 'User Created Successfully',
                'user' => $user
            ], 200);
        } else {
            return response()->json([
                'status' => true,
                'message' => 'OTP Expired'
            ], 200);
        }
    }

    public function login(Request $request)
    {
        $validateUser = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);
        if ($validateUser->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication Failed',
                'errors' => $validateUser->errors()->all()
            ], 401);
        }

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $authUser = Auth::user();

            if ($authUser->status) {
                return response()->json([
                    'status' => true,
                    'message' => 'User Logged in Successfully',
                    'token' => $authUser->createToken("API Token")->plainTextToken,
                    "user" => $authUser
                ], 200);
            } else {
                return response()->json([
                    'status' => true,
                    'message' => 'Your account is disabled. Please contact you Admin!',
                ], 401);
            }
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Authentication Failed',
                'errors' => $validateUser->errors()->all()
            ], 401);
        }
    }


    public function googleAuthentication(Request $request)
    {
        // $userData = $request->token;
        // return response()->json($userData);
        try {

            // $GOOGLE_CLIENT_ID = '23621445607-9o9nu3u9nv7ijteb42keimco618mkarf.apps.googleusercontent.com';
            // $GOOGLE_CLIENT_SECRET = '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';
            // $GOOGLE_CALLBACK_REDIRECTS = 'http://localhost:5173';

            $googleUser = Socialite::driver('google')->user();
            // return response()->json($googleUser);

            $user = User::where('google_id', $googleUser->getId())->first();

            if ($user) {
                Auth::login($user);

                return response()->json([
                    'status' => true,
                    'message' => 'User logged in successfully.',
                    'user' => $user,
                ], 200);
            } else {
                $userData = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'password' => Hash::make('password'),
                    'google_id' => $googleUser->getId(),
                ]);


                Auth::login($userData);

                return response()->json([
                    'status' => true,
                    'message' => 'User created and logged in successfully.',
                    'user' => $userData,
                ], 200);
            }
        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Google login failed. Please try again.',
                'error' => $e->getMessage(), // Include the exception message for debugging
            ], 401);
        }
    }


    public function facebookAuthentication(Request $request)
    {
        try {
            // Get the Facebook user details using the token sent by the frontend
            $facebookUser = Socialite::driver('facebook')->userFromToken($request->token);

            // Check if a user already exists with the given Facebook ID
            $user = User::where('facebook_id', $facebookUser->getId())->first();

            if ($user) {
                // Log in the existing user
                Auth::login($user);

                return response()->json([
                    'status' => true,
                    'message' => 'User logged in successfully.',
                    'user' => $user,
                ], 200);
            } else {
                // Create a new user if none exists with the given Facebook ID
                $userData = User::create([
                    'name' => $facebookUser->getName(),
                    'email' => $facebookUser->getEmail(),
                    'password' => Hash::make('password'), // Default password for social login
                    'facebook_id' => $facebookUser->getId(),
                ]);

                // Log in the newly created user
                Auth::login($userData);

                return response()->json([
                    'status' => true,
                    'message' => 'User created and logged in successfully.',
                    'user' => $userData,
                ], 200);
            }
        } catch (\Exception $e) {
            // Handle any errors during the Facebook login process
            return response()->json([
                'status' => false,
                'message' => 'Facebook login failed. Please try again.',
                'error' => $e->getMessage(), // Include exception message for debugging
            ], 401);
        }
    }



    public function sendMail($email, $subject, $otp)
    {
        // send mail
        $emailData = [
            "subject" => $subject,
            "email_otp" => $otp,
        ];
        Mail::to($email)->send(new Email($emailData));
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();

        return response()->json([
            'status' => true,
            'message' => 'User logged Out Successfully',
        ], 401);
    }


    
}
