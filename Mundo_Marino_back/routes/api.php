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




Route::middleware('auth:api')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);

    Route::post("park",[ParkController::class,"store"]);
    Route::put("park/{id}",[ParkController::class,"update"]);
    Route::delete("park/{id}",[ParkController::class,"delete"]);

    Route::post("attraction",[AttractionController::class,"store"]);
    Route::put("attraction/{id}",[AttractionController::class,"update"]);
    Route::delete("attraction/{id}",[AttractionController::class,"delete"]);

    Route::post("restaurant",[RestaurantController::class,"store"]);
    Route::put("restaurant/{id}",[RestaurantController::class,"update"]);
    Route::delete("restaurant/{id}",[RestaurantController::class,"delete"]);

    Route::get("park_reservations",[Park_reservationController::class,"index"]);
    Route::get("park_reservation/{id}",[Park_reservationController::class,"show"]);

    Route::post("park_reservation",[Park_reservationController::class,"store"]);
    Route::put("park_reservation/{id}",[Park_reservationController::class,"edit"]);
    Route::delete("park_reservation/{id}",[Park_reservationController::class,"delete"]);

    Route::post("park_reservation/userLimit",[Park_reservationController::class,"setUserLimit"]);

    Route::post("restaurant_reservation/userLimit/{id}",[Restaurant_reservationController::class,"setUserLimit"]);

    Route::get("restaurant_reservations",[Restaurant_reservationController::class,"index"]);
    Route::get("restaurant_reservation/{id}",[Restaurant_reservationController::class,"show"]);

    Route::post("restaurant_reservation",[Restaurant_reservationController::class,"store"]);
    Route::put("restaurant_reservation/{id}",[Restaurant_reservationController::class,"edit"]);
    Route::delete("restaurant_reservation/{id}",[Restaurant_reservationController::class,"delete"]);

    Route::get("admin_logs",[Admin_logController::class,"index"]);
    Route::get("admin_log/{id}",[Admin_logController::class,"show"]);
    Route::post("admin_log",[Admin_logController::class,"store"]);
});
