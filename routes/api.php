<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);
    // Route::apiResource('users', \App\Http\Controllers\Api\UserController::class);

    Route::apiResource('events', \App\Http\Controllers\Api\EventController::class);
});

Route::post('/signup', [\App\Http\Controllers\Api\AuthController::class, 'signup']);
Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
