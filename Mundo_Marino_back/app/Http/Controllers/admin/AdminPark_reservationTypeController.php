<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Admin_log;
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

            $this->log('insert', 'park_reservation_types', '', "name: {$tipo->name}");

            return response()->json($tipo, 201);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
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
