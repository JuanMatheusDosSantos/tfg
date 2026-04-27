<?php

namespace App\Http\Controllers;

use App\Mail\ReservaMail;
use App\Models\Restaurant;
use App\Models\Restaurant_reservation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class Restaurant_reservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reservations = Restaurant_reservation::with("user")->get();
        return response()->json($reservations);
    }
    public function userReservation()
    {
        $userID=Auth::id();
        $reservations = Restaurant_reservation::where("user_id",$userID)->with("user")->get();
        return response()->json($reservations);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $reservation = Restaurant_reservation::with("restaurant")->findOrFail($id);
            return response()->json($reservation);
        } catch (\Exception $e) {
            return response()->json(["message" =>
                $e->getMessage()
//                "no se ha podido encontrar la reserva del restaurante"
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
                "status" => "required|in:cancelled,pending"
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

        $request->merge(['restaurant_id' => $reservation->restaurant_id]);
        $limite = $this->userLimit($request, $id);
        if ($limite) return $limite;

        $this->authorize('update', $reservation);
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
            if (count($cambios) > 0) {
                return response()->json(["message" => "se ha cambiado correctamente " . implode(", ", $cambios)]);
            } else {
                return response()->json(["message" => "No se ha realizado ningún cambio"]);
            }
        } catch (\Exception $e) {
            return response()->json([
//                    $e->getMessage()
                "ha habido un error ha la hora de editar la reserva, introduce correctamente los campos"
            ], 400);
        }
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

        // Comprobar reserva duplicada
        $reservaExistente = Restaurant_reservation::where('user_id', $request->user_id)
            ->where('restaurant_id', $request->restaurant_id)
            ->where('reservation_date', $request->reservation_date)
            ->where('reservation_hour', $request->reservation_hour)
            ->whereNotIn('status', ['cancelled'])
            ->first();

        if ($reservaExistente) {
            return response()->json([
                'message' => 'Ya tienes una reserva en este restaurante para ese día y hora.'
            ], 422);
        }

        $limite = $this->userLimit($request);
        if ($limite) return $limite;

        try {
            $reservation= Restaurant_reservation::create([
                "user_id" => $request->user_id,
                "restaurant_id" => $request->restaurant_id,
                "reservation_date" => $request->reservation_date,
                "reservation_hour" => $request->reservation_hour,
                "party_size" => $request->party_size,
            ]);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 400);

        }
        $user = User::findOrFail($request->user_id);
        Mail::to($user->email)->send(new ReservaMail($reservation, 'restaurante'));
        return response()->json(["message" => "se ha guardado correctamente"], 200);
    }

    public function userLimit($request, $excludeId = null)
    {
        $max = Restaurant::findOrFail($request->restaurant_id)->max_capacity;
        $party_size = $request->party_size;

        $hora = \Carbon\Carbon::createFromFormat('H:i', $request->reservation_hour);
        $desde = $hora->copy()->subMinutes(30)->format('H:i');
        $hasta = $hora->copy()->addMinutes(30)->format('H:i');

        $query = Restaurant_reservation::where("restaurant_id", $request->restaurant_id)
            ->where("reservation_date", $request->reservation_date)
            ->whereBetween("reservation_hour", [$desde, $hasta])
            ->whereNotIn("status", ["cancelled"]);

        if ($excludeId) {
            $query->where("id", "!=", $excludeId);
        }

        $ocupacion = $query->sum("party_size");

        if ($ocupacion + $party_size > $max) {
            $disponibles = $max - $ocupacion;
            return response()->json([
                "message" => "No hay suficientes plazas. Solo quedan {$disponibles} plazas para esta franja horaria."
            ], 422);
        }

        return null;
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
        $this->authorize('delete', $restReserva);
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
