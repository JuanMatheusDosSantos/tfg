<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class AdminRestaurantController extends Controller
{
    function index()
    {
        try {
            $restaurants = Restaurant::all();
            return response()->json($restaurants);
        } catch (\Exception $e) {
            return response()->json(["Ha ocurrido un error a la hora de mostrar todas los restaurantes"], 400);
        }
    }

    function show($id)
    {
        try {
            $restaurant = Restaurant::findOrFail($id);
            return response()->json($restaurant);
        } catch (\Exception $e) {
            return response()->json(["Ha ocurrido un fallo a la hora de buscar esta atracción"], 404);
        }
    }

    function store(Request $request)
    {
        $request->validate([
            "name"         => "required|string|max:255",
            "max_capacity" => "required|integer|min:1",
            "park_id"      => "required|integer|exists:parks,id",
            "opening_time" => "nullable|date_format:H:i",
            "closing_time" => "nullable|date_format:H:i",
        ]);

        try {
            Restaurant::create([
                "name"         => $request->name,
                "max_capacity" => $request->max_capacity,
                "park_id"      => $request->park_id,
                "opening_time" => $request->opening_time,
                "closing_time" => $request->closing_time,
            ]);
            return response()->json(["se ha guardado correctamente el restaurante"], 201);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 500);
        }
    }
    function update(Request $request, $id)
    {
        $request->validate([
            "name" => "required|string|max:255",
            "max_capacity" => "required|integer|min:1|max:15",
            "park_id" => "required|integer|exists:parks,id"
        ]);

        $restaurant = Restaurant::findOrFail($id);
        $this->authorize("update", $restaurant);
        try {
            $restaurant->name = $request->name;
            $restaurant->max_capacity = $request->max_capacity;
            $restaurant->park_id = $request->park_id;
            $restaurant->save();
            return response()->json(["se ha cambiado correctamente la informacion del restaurante",]);
        } catch (\Exception $e) {
//            return response()->json(["ha ocurrido un error a la hora de cambiar el restaurante"],500);
            return response()->json([$e->getMessage()], 500);
        }
    }

    public function delete($id)
    {
        try {
            $restaurant = Restaurant::findOrFail($id);
            $this->authorize("delete", $restaurant);
            $restaurant->restaurant_reservation()->delete();
            $restaurant->delete();
            return response()->json(["se ha eliminado correctamente el restaurante"], 200);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json(["Sin permisos: " . $e->getMessage()], 403);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }
    }
    public function editCapacity(Request $request, $id)
    {
        try {
            $request->validate([
                "max_capacity" => "required|integer|min:1"
            ]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }

        try {
            $restaurant = Restaurant::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(["No se ha encontrado el restaurante"], 400);
        }

        try {
            if ($restaurant->max_capacity != $request->max_capacity) {
                $restaurant->max_capacity = $request->max_capacity;
                $restaurant->save();
                return response()->json(["se ha cambiado correctamente la capacidad"]);
            }
            return response()->json([""]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }
    }
}
