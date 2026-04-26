<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Admin_log;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;

class Admin_logController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        try {
            $this->authorize('viewAny', Admin_log::class);
            $logs=Admin_log::with("user")->get();
            return response()->json($logs);
        }catch (AuthenticationException $e){
            return  response()->json(["no tienes permisos"],403);
        }
        catch (\Exception $e){
            return response()->json([
                "ha habido un fallo al mostrar los logs"
            ],500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                "action"        => "required|string",
                "affected_zone" => "required|string",
                "old_value"     => "nullable",
                "new_value"     => "nullable",
            ]);
        }catch (\Exception $e){
            return response()->json([
                "ha habido un fallo al mostrar los logs",
//                $e->getMessage()
            ],400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $log=Admin_log::findOrFail($id);
            return response()->json($log);
        }catch (\Exception $e){
            return response()->json([
                "no se ha podido encontrar el log",
            ],404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public static function saveLog($action, $affected_zone, $old_value=null, $new_value=null)
    {
        Admin_log::create([
            "action" => $action,
            "affected_zone" => $affected_zone,
            "old_value" => $old_value?\Safe\json_encode($old_value):null,
            "new_value" => $new_value?\Safe\json_encode($new_value):null,
            "user_id"=>auth()->id(),
        ]);
    }
}
