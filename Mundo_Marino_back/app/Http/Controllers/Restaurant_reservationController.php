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
        } catch (\Exception $e) {
//            return response()->json(["message" => $e->getMessage()], 400);
            return response()->json([$request->user_id], 400);

        }
        return response()->json(["message" => "se ha guardado correctamente"], 200);
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
        try {
            $reservation = Restaurant_reservation::findOrFail($id);
            return response()->json($reservation);
        } catch (\Exception $e) {
            return response()->json(["message" =>
//                $e->getMessage()
                "no se ha podido encontrar la reservación"
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
                "status" => "required|in:cancelled"
            ]);
        } catch (\Exception $e) {
            return response()->json([
//                    $e->getMessage()
                "ha habido un error en la validacion, introduce correctamente los campos"
            ], 400);
        }

        try {
            $reservation = Restaurant_reservation::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(["ha habido un fallo al buscar la reserva"], 400);
        }
        try {
            $cambios = [];
            if ($reservation->reservation_date != $request->reservation_date) {
                $reservation->reservation_date = $request->reservation_date;
                $cambios[] = "dia de la reserva";
            }
            if ($reservation->reservation_hour != $request->reservation_hour) {
                $reservation->reservation_hour = $request->reservation_hour;
                $cambios[] = "hora de la reserva";
            }
            if ($reservation->party_size != $request->party_size) {
                $reservation->party_size = $request->party_size;
                $cambios[] = "tamaño de la reserva";
            }
            if ($reservation->status != $request->status) {
                $cambios[] = "estado de la reserva";
                $reservation->status = $request->status;
            }
            $reservation->save();
            if ($cambios > 0) {
                return response()->json(["se ha cambiado correctamente " . implode(", ", $cambios)]);
            } else {
                return response()->json([""]);
            }
        } catch (\Exception $e) {
            return response()->json([
//                    $e->getMessage()
                "ha habido un error ha la hora de editar la reserva, introduce correctamente los campos"
            ], 400);
        }
    }

    public function userLimit(
        $request
//    Request $request,
    )
    {
        $max = Restaurant::findOrFail($request->restaurant_id)->max_capacity;
        $party_size = $request->party_size;
        $reservation = Restaurant_reservation::where("restaurant_id", $request->restaurant_id)->where("reservation_date", $request->reservation_date)
            ->where("reservation_hour", $request->reservation_hour)->whereNotIn("status", ["cancelleduser"])->sum("party_size");
        if ($reservation + $party_size > $max) {
            return response()->json([
                "message" => "esta hora esta llena, pruebe con otra"
            ], 400);
        }
    }

    public function setUserLimit(Request $request,$id){
        $new_max=$request->max_capacity;
        try{
        $old_max=Restaurant::findOrFail($id)->max_capacity;
        }catch (\Exception $e){
            return response()->json(["error"=>"no se ha podido encontrar el restaurante"],400);
        }
        if ($new_max!=$old_max){
            try{
            Restaurant::findOrFail($request->restaurant_id)->max_capacity=$new_max;
            }catch (\Exception $e){
                return response()->json(["error"=>"no se ha podido actualizar la capacidad del restaurante"],400);
            }
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
    public function delete($id)
    {
        try {
            $restReserva = Restaurant_reservation::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(["no se ha podido encontrar la reserva, por favor, revise la reserva"], 400);
        }
        if ($restReserva->status == "check_in") {
            return response()->json(["no puedes borrar una reserva completa"]);
        }
        try {
            $restReserva->delete();
        } catch (\Exception $e) {
            return response()->json(["no se ha podido eliminar la reserva, por favor, intentelo mas tarde"]);
        }
        return response()->json(["se ha borrado correctamente la reserva"]);
    }
}
