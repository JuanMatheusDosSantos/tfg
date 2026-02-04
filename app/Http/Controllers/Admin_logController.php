<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Admin_log;
use Illuminate\Http\Request;

class Admin_logController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $logs=Admin_log::all();
            return response()->json($logs);
        }catch (\Exception $e){
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
                "action"=>$request->action,
                "affected_zone"=>$request->affected_zone,
                "old_value"=>$request->old_value,
                "new_value"=>$request->new_value,
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
            ],500);
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
}
