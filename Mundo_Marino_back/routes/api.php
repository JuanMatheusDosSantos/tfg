<?php

use App\Http\Controllers\AttractionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Park_reservationController;
use App\Http\Controllers\ParkController;
use App\Http\Controllers\Admin_logController;
use App\Http\Controllers\Payments;
use App\Http\Controllers\Restaurant_reservationController;
use App\Http\Controllers\RestaurantController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

Route::get("parks",[ParkController::class,"index"]);
Route::get("park/{id}",[ParkController::class,"show"]);

Route::get("atracciones",[AttractionController::class,"index"]);
Route::get("atraccion/{id}",[AttractionController::class,"show"]);

Route::get("atraccion/type/{type}",[AttractionController::class,"filterByType"]);
Route::get("atraccion/parque/{id}",[AttractionController::class,"filterByPark"]);

Route::get("restaurantes",[RestaurantController::class,"index"]);
Route::get("restaurante/{id}",[RestaurantController::class,"show"]);

Route::get("park_reservations",[Park_reservationController::class,"index"]);
Route::get("park_reservation/{id}",[Park_reservationController::class,"show"]);

Route::get("restaurant_reservations",[Restaurant_reservationController::class,"index"]);
Route::get("restaurant_reservation/{id}",[Restaurant_reservationController::class,"show"]);


Route::middleware('auth:api')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);

    Route::post("park","store");
    Route::put("park/{id}","update");
    Route::delete("park/{id}","delete");

    Route::post("atraccion","store");
    Route::put("atraccion/{id}","update");
    Route::delete("atraccion/{id}","delete");

    Route::post("restaurante","store");
    Route::put("restaurante/{id}","update");
    Route::delete("restaurante/{id}","delete");

    Route::post("park_reservation","store");
    Route::put("park_reservation/{id}","edit");
    Route::delete("park_reservation/{id}","delete");

    Route::post("park_reservation/userLimit",[Park_reservationController::class,"setUserLimit"]);

    Route::post("restaurant_reservation/userLimit/{id}",[Restaurant_reservationController::class,"setUserLimit"]);

    Route::post("restaurant_reservation","store");
    Route::put("restaurant_reservation/{id}","edit");
    Route::delete("restaurant_reservation/{id}","delete");

    Route::get("admin_logs",["index"]);
    Route::get("admin_log/{id}",["show"]);
    Route::post("admin_log","store");
});
