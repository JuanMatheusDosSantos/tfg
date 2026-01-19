<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attraction;

class AttractionController extends Controller
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

    function filterByType($type)
    {
        try {



            $attraction=Attraction::where("type",$type)->get();
            if ($attraction->count()==0){
                return response()->json(["no hay ninguna atraccion de este tipo"],
//                    204
                    200
                );
            }
            return response()->json($attraction,200);
        }catch (\Exception){
            return response()->json(["ha habido un error, comprueba que el typo sigue existiendo"],404);
        }
    }

    function filterByPark()
    {

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

    function update(Request $request, $id)
    {
        $request->validate([
        "name"=>"required|string|max:255",
        "type"=>"required|string",
        "duration"=>"required|integer|min:1|max:99",
        "max_capacity"=>"required|integer|min:1|max:15",
        "park_id"=>"required|integer|exists:parks,id"
    ]);

            $attraction=Attraction::findOrFail($id);
        try {
            $attraction->name=$request->name;
            $attraction->type=$request->type;
            $attraction->duration=$request->duration;
            $attraction->max_capacity=$request->max_capacity;
            $attraction->park_id=$request->park_id;
            $attraction->save();
            return response()->json(["se ha cambiado correctamente la informacion de la atraccion",]);
        }catch (\Exception $e){
//            return response()->json(["ha ocurrido un error a la hora de cambiar la atracción"],500);
            return response()->json([$e->getMessage()],500);
        }
    }
    function delete($id)
    {
        try {
           Attraction::findOrFail($id)->delete();
           return response()->json(["se ha eliminado correctamente la atraccion"]);
        }catch (\Exception $e){
            return response()->json(["no se ha encontrado la atracción"],400);
        }
    }
}
