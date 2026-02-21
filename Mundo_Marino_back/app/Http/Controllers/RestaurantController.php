<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Park;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class RestaurantController extends Controller
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
            "name" => "required|string|max:255",
            "max_capacity" => "required|integer|min:1|max:15",
            "park_id" => "required|integer|exists:parks,id"
        ]);

        try {
            Restaurant::create([
                "name" => $request->get("name"),
                "max_capacity" => $request->get("max_capacity"),
                "park_id" => $request->get("park_id")
            ]);
            return response()->json(["se ha guardado correctamente el restaurante"], 201);
        } catch (\Exception $e) {
//            return response()->json(["ha ocurrido un error a la hora de guardar la atracción"],500);
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

    function delete($id)
    {
        try {
            $restaurant = Restaurant::findOrFail($id);
            $restaurant->Restaurant_reservations()->delete();
            $restaurant->delete();
            return response()->json(["se ha eliminado correctamente el restaurante"], 204);
        } catch (\Exception $e) {
            return response()->json(["no se ha encontrado el restaurante"], 400);
        }
    }
}
