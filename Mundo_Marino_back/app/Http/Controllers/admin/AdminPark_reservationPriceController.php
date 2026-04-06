<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
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
