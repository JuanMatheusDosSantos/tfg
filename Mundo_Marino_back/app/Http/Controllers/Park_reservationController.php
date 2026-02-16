<?php

namespace App\Http\Controllers;

use App\Models\Park;
use App\Models\Park_reservation;
use Illuminate\Http\Request;

class Park_reservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $parks=Park_reservation::all();
            return response()->json($parks);
        }catch (\Exception $e){
            \Log::channel("park_reservation")->error("".$e->getMessage());
            return response()->json([
                "ha habido un error a la hora de mostrar los parques, por favor intentelo mas tarde"
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
                "user_id"=>"required",
                "park_id"=>"required",
                "reservation_date"=>"required|date"
            ]);
        }catch (\Exception $e){
            return response()->json(["por favor, rellene las cosas correctamente"],400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $reservation=Park_reservation::findOrFail($id);
            return response()->json($reservation);
        }catch (\Exception $e){
            return response()->json(["ha habido un fallo al intentar mostrar la reserva"],400);
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
                "max_persons" => "required|numeric|min:1",
                "status" => "required|in:cancelled"
            ]);
        } catch (\Exception $e) {
            return response()->json([
//                    $e->getMessage()
                "ha habido un error en la validacion, introduce correctamente los campos"
            ], 400);
        }

        try {
            $reservation = Park_reservation::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(["ha habido un fallo al buscar la reserva"], 400);
        }
        try {
            $cambios = [];
            if ($reservation->reservation_date != $request->reservation_date) {
                $reservation->reservation_date = $request->reservation_date;
                $cambios[] = "dia de la reserva";
            }
            if ($reservation->max_persons != $request->max_persons) {
                $reservation->max_persons = $request->max_persons;
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


    /**
     * Remove the specified resource from storage.
     */
    public function delete($id)
    {

        try {
            $restReserva = Park_reservation::findOrFail($id);
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
    public function userLimit(
        $request
//    Request $request,
    )
    {
        $max = Park::findOrFail($request->restaurant_id)->max_capacity;
        $party_size = $request->party_size;
        $reservation = Park_reservation::where("restaurant_id", $request->restaurant_id)->where("reservation_date", $request->reservation_date)
            ->where("reservation_hour", $request->reservation_hour)->whereNotIn("status", ["cancelleduser"])->sum("party_size");
        if ($reservation + $party_size > $max) {
            return response()->json([
                "message" => "esta hora esta llena, pruebe con otra"
            ], 400);
        }
    }
}
