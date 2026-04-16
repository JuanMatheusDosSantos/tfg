<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Park_reservation;
use App\Models\Park_reservationPrice;
use App\Models\Park_reservationType;
use Illuminate\Http\Request;

class AdminPark_reservationTypeController extends Controller
{
    public function index()
    {
        try {
            $types=Park_reservationType::all();
            return response()->json($types);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 500);
        }
    }
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:park_reservation_types,name',
            ]);

            $tipo = Park_reservationType::create([
                'name' => $request->name,
            ]);

            return response()->json($tipo, 201);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 500);
        }
    }
}
