<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Park;
use Illuminate\Http\Request;

class AdminParkController extends Controller
{
    function index()
    {
        try {
            $parks = Park::with("attractions")->get();
            return response()->json($parks);
        } catch (\Exception $e) {
            return response()->json(["Ha ocurrido un error a la hora de mostrar todas las attraciones"], 400);
        }
    }

    function show($id)
    {
        try {
            $park = Park::with("attractions")->withCount([
                'attractions',
                'attractions as operational_count' => fn($q) => $q->where('status', 'operational'),
                'attractions as maintenance_count'  => fn($q) => $q->where('status', 'maintenance'),
                'attractions as closed_count'       => fn($q) => $q->where('status', 'closed'),
                'attractions as permanently_closed'       => fn($q) => $q->where('status', 'permanently_closed'),
            ])->findOrFail($id);
            return response()->json($park);
        } catch (\Exception $e) {
            return response()->json(["Ha ocurrido un fallo a la hora de buscar esta atracción"], 404);
        }
    }

    function filterBylocation($location)
    {
        try {
            $park = Park::where("location", $location)->get();
            if ($park->count() == 0) {
                return response()->json(["no hay ninguna atracción de este tipo"],
//                    204
                    200
                );
            }
            return response()->json($park, 200);
        } catch (\Exception) {
            return response()->json(["ha habido un error, comprueba que el typo sigue existiendo"], 404);
        }
    }

    function store(Request $request)
    {
        try {
            $this->authorize("create", Park::class);
        } catch (\Exception $e) {
            return response()->json(["no tienes los permisos necesarios"], 403);
        }
        try {
            $request->validate([
                "name" => "required|string|max:255",
                "location" => "required|string",
                "opening_time" => "required|date_format:H:i",
                "closing_time" => "required|date_format:H:i|after:opening_time",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "error",
//                "ha habido un error en la validacion"
                $e->getMessage()
            ], 400);
        }
        try {
            Park::create([
                "name" => $request->get("name"),
                "location" => $request->get("location"),
                "opening_time" => $request->get("opening_time"),
                "closing_time" => $request->get("closing_time")
            ]);
            return response()->json(["se ha guardado correctamente la atracción"], 201);
        } catch (\Exception $e) {
//            return response()->json(["ha ocurrido un error a la hora de guardar la atracción"],500);
            return response()->json([$e->getMessage()], 500);
        }
    }

    function update(Request $request, $id)
    {
        $request->validate([
            "name" => "sometimes|string|max:255",
            "location" => "sometimes|string",
            "opening_time" => "sometimes|date_format:H:i",
            "closing_time" => "sometimes|date_format:H:i|after:opening_time",
        ]);

        $park = Park::findOrFail($id);
        $this->authorize("update",$park);
        try {
            $park->name = $request->name;
            $park->location = $request->location;
            $park->opening_time = $request->opening_time;
            $park->closing_time = $request->closing_time;
            $park->save();
            return response()->json(["se ha cambiado correctamente la informacion de la atraccion",]);
        } catch (\Exception $e) {
//            return response()->json(["ha ocurrido un error a la hora de cambiar la atracción"],500);
            return response()->json([$e->getMessage()], 500);
        }
    }

    function delete($id)
    {
        $park = Park::findOrFail($id);
        try{
            $this->authorize("delete", $park);
        }catch (\Exception $e){
            return response()->json(["no tienes los permisos necesarios"], 401);
        }
        try {
            $park->restaurant()->each(function ($restaurant) {
                $restaurant->restaurant_reservations()->delete();
            });
            $park->restaurant()->delete();
            $park->park_reservations()->delete();
            $park->delete();
            return response()->json(["se ha eliminado correctamente el parque"], 200);
        } catch (\Exception $e) {
            return response()->json(
//                ["hubo un problema al eliminar el parque"]
                $e->getMessage()
                , 400);
        }
    }
}
