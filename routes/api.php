<?php

use App\Http\Controllers\AttractionController;
use App\Http\Controllers\Park_reservationController;
use App\Http\Controllers\ParkController;
use App\Http\Controllers\Admin_logController;
use App\Http\Controllers\Payments;
use App\Http\Controllers\Restaurant_reservationController;
use App\Http\Controllers\RestaurantController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::controller(AttractionController::class)->group(function (){
    Route::get("atracciones","index");
    Route::get("atraccion/{id}","show");
    Route::post("atraccion","store");
    Route::put("atraccion/{id}","update");
    Route::delete("atraccion/{id}","delete");
    Route::get("atraccion/type/{type}","filterByType");
    Route::get("atraccion/parque/{id}","filterByPark");
});
Route::controller(RestaurantController::class)->group(function(){
    Route::get("restaurantes","index");
    Route::get("restaurante/{id}","show");
    Route::post("restaurante","store");
    Route::put("restaurante/{id}","update");
    Route::delete("restaurante/{id}","delete");
});
Route::controller(ParkController::class)->group(function (){
    Route::get("parks","index");
    Route::get("park/{id}","show");
    Route::post("park","store");
    Route::put("park/{id}","update");
    Route::delete("park/{id}","delete");
});
Route::controller(Restaurant_reservationController::class)->group(function (){
    Route::get("restaurant_reservations","index");
    Route::get("restaurant_reservation/{id}","show");
    Route::post("restaurant_reservation","store");
    Route::put("restaurant_reservation/{id}","edit");
    Route::delete("restaurant_reservation/{id}","delete");
    Route::post("restaurant_reservation/userLimit","userLimit");
});
Route::controller(Park_reservationController::class)->group(function (){
    Route::get("park_reservations","index");
    Route::get("park_reservation/{id}","show");
    Route::post("park_reservation","store");
    Route::put("park_reservation/{id}","edit");
    Route::delete("park_reservation/{id}","delete");
    Route::post("park_reservation/userLimit","userLimit");
});

