<?php

use App\Http\Controllers\AttractionController;
use App\Http\Controllers\ParkController;
use App\Http\Controllers\Admin_logController;
use App\Http\Controllers\Payments;
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
    Route::put("restaurante/update/{id}","update");
    Route::delete("restaurante/delete/{id}","delete");
});
Route::controller(ParkController::class)->group(function (){
    Route::get("parks","index");
    Route::get("park/{id}","show");
    Route::post("park","store");
});
