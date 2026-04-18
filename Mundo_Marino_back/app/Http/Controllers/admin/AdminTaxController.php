<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Admin_log;
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
//    public function store(Request $request)
//    {
//        try {
//            $request->validate([
//                'name'       => 'required|string|max:255',
//                'percentage' => 'required|numeric|min:0|max:100',
//                'active'     => 'boolean',
//            ]);
//
//            Tax::create([
//                'name'       => $request->name,
//                'percentage' => $request->percentage,
//                'active'     => $request->active ?? true,
//            ]);
//
//            return response()->json(['Impuesto creado correctamente'], 201);
//        } catch (\Exception $e) {
//            return response()->json([$e->getMessage()], 500);
//        }
//    }
//
//    /**
//     * Display the specified resource.
//     */
//    public function show(string $id)
//    {
//        //
//    }
//
//    /**
//     * Update the specified resource in storage.
//     */
//    public function update(Request $request, string $id)
//    {
//        try {
//            $request->validate(['percentage' => 'required|numeric|min:0|max:100']);
//            $tax = Tax::findOrFail($id);
//            $tax->percentage = $request->percentage;
//            $tax->save();
//            return response()->json(["Tax actualizado correctamente"]);
//        } catch (\Exception $e) {
//            return response()->json([$e->getMessage()], 500);
//        }
//    }
//    /**
//     * Remove the specified resource from storage.
//     */
//    public function destroy(string $id)
//    {
//        try {
//            Tax::findOrFail($id)->delete();
//            return response()->json(["Impuesto eliminado correctamente"]);
//        } catch (\Exception $e) {
//            return response()->json([$e->getMessage()], 500);
//        }
//    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name'       => 'required|string|max:255',
                'percentage' => 'required|numeric|min:0|max:100',
                'active'     => 'boolean',
            ]);

            $tax = Tax::create([
                'name'       => $request->name,
                'percentage' => $request->percentage,
                'active'     => $request->active ?? true,
            ]);

            $this->log('insert', 'taxes', '',
                "name: {$tax->name}, percentage: {$tax->percentage}, active: " . ($tax->active ? 'true' : 'false')
            );

            return response()->json(['Impuesto creado correctamente'], 201);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        try {
            $request->validate(['percentage' => 'required|numeric|min:0|max:100']);
            $tax = Tax::findOrFail($id);
            $old = "percentage: {$tax->percentage}";
            $tax->percentage = $request->percentage;
            $tax->save();

            $this->log('update', 'taxes', $old, "percentage: {$tax->percentage}");

            return response()->json(["Tax actualizado correctamente"]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $tax = Tax::findOrFail($id);
            $old = "name: {$tax->name}, percentage: {$tax->percentage}";
            $tax->delete();

            $this->log('delete', 'taxes', $old, '');

            return response()->json(["Impuesto eliminado correctamente"]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 500);
        }
    }

    private function log(string $action, string $table, string $old, string $new): void
    {
       Admin_log::create([
            'action'         => $action,
            'affected_table' => $table,
            'old_value'      => $old,
            'new_value'      => $new,
            'user_id'        => auth()->id(),
        ]);
    }

}
