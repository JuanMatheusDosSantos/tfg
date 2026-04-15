<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Tax;
use Illuminate\Http\Request;

class AdminTaxController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
            try {
                return response()->json(Tax::where('active', true)->get());
            } catch (\Exception $e) {
                return response()->json([$e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $request->validate(['percentage' => 'required|numeric|min:0|max:100']);
            $tax = Tax::findOrFail($id);
            $tax->percentage = $request->percentage;
            $tax->save();
            return response()->json(["Tax actualizado correctamente"]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 500);
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            Tax::findOrFail($id)->delete();
            return response()->json(["Impuesto eliminado correctamente"]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 500);
        }
    }
}
