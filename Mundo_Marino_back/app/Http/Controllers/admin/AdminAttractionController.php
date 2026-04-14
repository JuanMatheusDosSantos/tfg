<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Attraction;
use App\Models\Park;
use Illuminate\Http\Request;

class AdminAttractionController extends Controller
{
    function index()
    {
        try {
            $attractions = Attraction::all();
            return response()->json($attractions);
        } catch (\Exception $e) {
            return response()->json(["Ha ocurrido un error a la hora de mostrar todas las attraciones"], 400);
        }
    }

    function show($id)
    {
        try {
            $attraction = Attraction::findOrFail($id);
            return response()->json($attraction);
        } catch (\Exception $e) {
            return response()->json(["Ha ocurrido un fallo a la hora de buscar esta atracción"], 404);
        }
    }

    function store(Request $request)
    {
        $request->validate([
            "name"=>"required|string|max:255",
            "type"=>"required|string",
            "duration"=>"required|integer|min:1|max:99",
            "max_capacity"=>"required|integer|min:1|max:15",
            "park_id"=>"required|integer|exists:parks,id"
        ]);

        try {
            Attraction::create([
                "name"=>$request->get("name"),
                "type"=>$request->get("type"),
                "duration"=>$request->get("duration"),
                "max_capacity"=>$request->get("max_capacity"),
                "park_id"=>$request->get("park_id")
            ]);
            return response()->json(["se ha guardado correctamente la atracción"],201);
        }
        catch (\Exception $e){
//            return response()->json(["ha ocurrido un error a la hora de guardar la atracción"],500);
            return response()->json([$e->getMessage()],500);
        }
    }

//    function update(Request $request, $id)
//    {
//        $request->validate([
//            "name"=>"required|string|max:255",
//            "type"=>"required|string",
//            "duration"=>"required|integer|min:1|max:99",
//            "max_capacity"=>"required|integer|min:1|max:15",
//            "park_id"=>"required|integer|exists:parks,id"
//        ]);
//
//        $attraction=Attraction::findOrFail($id);
//        try {
//            $attraction->name=$request->name;
//            $attraction->type=$request->type;
//            $attraction->duration=$request->duration;
//            $attraction->max_capacity=$request->max_capacity;
//            $attraction->park_id=$request->park_id;
//            $attraction->save();
//            return response()->json(["se ha cambiado correctamente la informacion de la atraccion",]);
//        }catch (\Exception $e){
////            return response()->json(["ha ocurrido un error a la hora de cambiar la atracción"],500);
//            return response()->json([$e->getMessage()],500);
//        }
//    }

    function update(Request $request, $id)
    {
        $request->validate([
            "name"        => "required|string|max:255",
            "type"        => "required|string",
            "duration"    => "required|integer|min:1|max:99",
            "max_capacity"=> "required|integer|min:1",
            "park_id"     => "required|integer|exists:parks,id"
        ]);

        $attraction = Attraction::findOrFail($id);
        try {
            $attraction->name         = $request->name;
            $attraction->type         = $request->type;
            $attraction->duration     = $request->duration;
            $attraction->max_capacity = $request->max_capacity;
            $attraction->park_id      = $request->park_id;
            $attraction->status       = $request->status ?? $attraction->status;
            $attraction->min_height   = $request->min_height;

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('attractions', 'public');
                $attraction->image = asset('storage/' . $path);
            }
            if ($request->hasFile('image')) {
                // Borrar imagen anterior si existe
                if ($attraction->image) {
                    $oldPath = str_replace(asset('storage/'), '', $attraction->image);
                    \Storage::disk('public')->delete($oldPath);
                }
                $path = $request->file('image')->store('attractions', 'public');
                $attraction->image = asset('storage/' . $path);
            }
            $attraction->save();
            return response()->json(["se ha cambiado correctamente la informacion de la atraccion"]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 500);
        }
    }

    function delete($id)
    {
        try {
            $attraction=Attraction::findOrFail($id);
            $attraction->status="permanently_closed";
            $attraction->save();
            return response()->json(["se ha eliminado correctamente la atraccion"],200);
        }catch (\Exception $e){
            return response()->json([
//                "no se ha encontrado la atracción"
            $e->getMessage()
            ],400);
        }
    }
    public function editStatus(Request $request, $id)
    {
        try {
            $request->validate([
                "status" => "required|in:operational,maintenance,closed,permanently_closed"
            ]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }

        try {
            $attraction = Attraction::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(["No se ha encontrado la atracción"], 400);
        }

        try {
            $attraction->status = $request->status;
            $attraction->save();
            return response()->json(["Estado actualizado correctamente"]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }
    }
}
