<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;


Route::post('/signup', [AuthController::class, 'signUp']);
Route::post('/verifyOtpWithReg', [AuthController::class, 'verifyOtpWithReg']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/google-login', [AuthController::class, 'googleLogin']);
Route::post('/auth/google-callback', [AuthController::class, 'googleAuthentication'])->name('googleAuthentication');
Route::post('/auth/facebook-callback', [AuthController::class, 'facebookAuthentication'])->name('facebookAuthentication');

Route::get('/users/{id}', [UserController::class, 'show']);
Route::put('/userUpdate/{id}', [UserController::class, 'updateUser']);


Route::get('/profile/{userId}', [ProfileController::class, 'getProfile']);
Route::put('/profile/{userId}', [ProfileController::class, 'updateProfile']);

Route::middleware('auth:sanctum')->group(function (){
    Route::post('/getUserById', [UserController::class, 'getUserById']);
    // Route::post('/userUpdate/{id}', [UserController::class, 'updateUser']);
    // Route::get('/users/{id}', [UserController::class, 'show']);

    Route::post('/logout', [AuthController::class, 'logout']);
});
