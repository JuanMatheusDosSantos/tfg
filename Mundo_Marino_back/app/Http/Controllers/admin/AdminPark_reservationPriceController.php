<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Admin_log;
use App\Models\Park_reservationPrice;
use Illuminate\Http\Request;

class AdminPark_reservationPriceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            return response()->json(Park_reservationprice::with('type')->get());
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
//    public function store(Request $request)
//    {
//        try {
//            $request->validate([
//                'park_id'                  => 'required|integer|exists:parks,id',
//                'park_reservation_type_id' => 'required|integer|exists:park_reservation_types,id',
//                'adult_price'              => 'required|numeric|min:0',
//                'child_price'              => 'required|numeric|min:0',
//            ]);
//
//            Park_reservationPrice::create([
//                'park_id'                  => $request->park_id,
//                'park_reservation_type_id' => $request->park_reservation_type_id,
//                'adult_price'              => $request->adult_price,
//                'child_price'              => $request->child_price,
//            ]);
//
//            return response()->json(['Precio creado correctamente'], 201);
//        } catch (\Exception $e) {
//            return response()->json([$e->getMessage()], 400);
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
//            $request->validate([
//                'adult_price' => 'required|numeric|min:0',
//                'child_price' => 'required|numeric|min:0',
//            ]);
//            $precio = Park_reservationPrice::findOrFail($id);
//            $precio->adult_price = $request->adult_price;
//            $precio->child_price = $request->child_price;
//            $precio->save();
//            return response()->json(["Precio actualizado correctamente"]);
//        } catch (\Exception $e) {
//            return response()->json([$e->getMessage()], 500);
//        }
//    }
//
//    /**
//     * Remove the specified resource from storage.
//     */
//    public function destroy(string $id)
//    {
//        try {
//            Park_reservationPrice::findOrFail($id)->delete();
//            return response()->json(["Precio eliminado correctamente"]);
//        } catch (\Exception $e) {
//            return response()->json([$e->getMessage()], 500);
//        }
//    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'park_id'                  => 'required|integer|exists:parks,id',
                'park_reservation_type_id' => 'required|integer|exists:park_reservation_types,id',
                'adult_price'              => 'required|numeric|min:0',
                'child_price'              => 'required|numeric|min:0',
            ]);

            $precio = Park_reservationPrice::create([
                'park_id'                  => $request->park_id,
                'park_reservation_type_id' => $request->park_reservation_type_id,
                'adult_price'              => $request->adult_price,
                'child_price'              => $request->child_price,
            ]);

            $this->log('insert', 'park_reservation_prices', '',
                "park_id: {$precio->park_id}, type_id: {$precio->park_reservation_type_id}, adult_price: {$precio->adult_price}, child_price: {$precio->child_price}"
            );

            return response()->json(['Precio creado correctamente'], 201);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }
    }

    public function show(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        try {
            $request->validate([
                'adult_price' => 'required|numeric|min:0',
                'child_price' => 'required|numeric|min:0',
            ]);

            $precio = Park_reservationPrice::findOrFail($id);
            $old = "adult_price: {$precio->adult_price}, child_price: {$precio->child_price}";

            $precio->adult_price = $request->adult_price;
            $precio->child_price = $request->child_price;
            $precio->save();

            $this->log('update', 'park_reservation_prices', $old,
                "adult_price: {$precio->adult_price}, child_price: {$precio->child_price}"
            );

            return response()->json(["Precio actualizado correctamente"]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $precio = Park_reservationPrice::findOrFail($id);
            $old = "park_id: {$precio->park_id}, type_id: {$precio->park_reservation_type_id}, adult_price: {$precio->adult_price}, child_price: {$precio->child_price}";
            $precio->delete();

            $this->log('delete', 'park_reservation_prices', $old, '');

            return response()->json(["Precio eliminado correctamente"]);
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
