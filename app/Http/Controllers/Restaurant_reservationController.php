<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use App\Models\Restaurant_reservation;
use Illuminate\Http\Request;

class Restaurant_reservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reservations = Restaurant_reservation::all();
        return response()->json($reservations);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                "user_id" => "required|exists:users,id",
                'restaurant_id' => 'required|exists:restaurants,id',
                'reservation_date' => 'required|date|after_or_equal:today',
                "reservation_hour" => "required|date_format:H:i",
                "party_size" => "required|numeric|min:1",
            ]);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 400);
        }
        $this->userLimit($request);
        try {
            Restaurant_reservation::create([
                "user_id" => $request->user_id,
                "restaurant_id" => $request->restaurant_id,
                "reservation_date" => $request->reservation_date,
                "reservation_hour" => $request->reservation_hour,
                "party_size" => $request->party_size,
            ]);
        }catch (\Exception $e){
            return response()->json(["message" => $e->getMessage()], 400);
        }
        return response()->json(["message"=>"se ha guardado correctamente"], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
//    public function create(Request $request)
//    {
//        //
//    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
        $reservation=Restaurant_reservation::findOrFail($id);
        return response()->json($reservation);
        }catch (\Exception $e){
            return response()->json(["message" =>
                $e->getMessage()
//                "no se ha podido encontrar la reservación"
            ],
                400);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, $id)
    {
        try {
            $request->validate([
                "reservation_date" => "required|date|after_or_equal:today",
                "reservation_hour" => "required|date_format:H:i",
                "party_size" => "required|numeric|min:1",
                "status"=>"required|in:cancelled"
            ]);
        }catch (\Exception $e){
            return response()->json([
                "message" =>
                    $e->getMessage()
            ], 400);
        }

    }
    public function userLimit(
        $request
//    Request $request,
    ){
        $max = Restaurant::findOrFail($request->restaurant_id)->max_capacity;
        $party_size = $request->party_size;
        $reservation = Restaurant_reservation::where("restaurant_id",$request->restaurant_id)->where("reservation_date",$request->reservation_date)
            ->where("reservation_hour",$request->reservation_hour)->whereNotIn("status",["cancelleduser"])->sum("party_size");
        if ($reservation + $party_size > $max) {
            return response()->json([
                "message" => "esta hora esta llena, pruebe con otra"
            ], 400);
        }
    }

    /**
     * Update the specified resource in storage.
     */
//    public function update(Request $request, string $id)
//    {
//        //
//    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
