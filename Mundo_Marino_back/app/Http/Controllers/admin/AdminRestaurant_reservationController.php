<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Admin_log;
use App\Models\Park_reservation;
use App\Models\Restaurant;
use App\Models\Restaurant_reservation;
use Illuminate\Http\Request;

class AdminRestaurant_reservationController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reservations = Restaurant_reservation::with("user")->get();
        return response()->json($reservations);
    }

    /**
     * Show the form for creating a new resource.
     */

    public function store(Request $request)
    {
        try {
            $request->validate([
                "user_id"          => "required|exists:users,id",
                'restaurant_id'    => 'required|exists:restaurants,id',
                'reservation_date' => 'required|date|after_or_equal:today',
                "reservation_hour" => "required|date_format:H:i",
                "party_size"       => "required|numeric|min:1",
            ]);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 400);
        }

        $limite = $this->userLimit($request);
        if ($limite) return $limite;

        $this->authorize("create",Park_reservation::class);
        try {
            $reservation = Restaurant_reservation::create([
                "user_id"          => $request->user_id,
                "restaurant_id"    => $request->restaurant_id,
                "reservation_date" => $request->reservation_date,
                "reservation_hour" => $request->reservation_hour,
                "party_size"       => $request->party_size,
            ]);

            $this->log('insert', 'restaurant_reservations', '',
                "user_id: {$reservation->user_id}, restaurant_id: {$reservation->restaurant_id}, date: {$reservation->reservation_date}, hour: {$reservation->reservation_hour}, party_size: {$reservation->party_size}"
            );

            return response()->json(["message" => "se ha guardado correctamente"], 200);
        } catch (\Exception $e) {
            return response()->json([$request->user_id], 400);
        }
    }

    public function show(string $id)
    {
        try {
            $reservation = Restaurant_reservation::with(["user", "restaurant"])->findOrFail($id);
            return response()->json($reservation);
        } catch (\Exception $e) {
            return response()->json(["message" => "no se ha podido encontrar la reservación"], 400);
        }
    }

    public function edit(Request $request, $id)
    {
        try {
            $request->validate([
                "reservation_date" => "required|date|after_or_equal:today",
                "reservation_hour" => "required|date_format:H:i",
                "party_size"       => "required|numeric|min:1",
                "status" => "required|in:checked_in,late,no_show,cancelled,completed,pending,accepted"
            ]);
        } catch (\Exception $e) {
            return response()->json(["ha habido un error en la validacion, introduce correctamente los campos"], 400);
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
            $old = "date: {$reservation->reservation_date}, hour: {$reservation->reservation_hour}, party_size: {$reservation->party_size}, status: {$reservation->status}";
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
                $reservation->status = $request->status;
                $cambios[] = "estado de la reserva";
            }

            $reservation->save();

            if (count($cambios) > 0) {
                $new = "date: {$reservation->reservation_date}, hour: {$reservation->reservation_hour}, party_size: {$reservation->party_size}, status: {$reservation->status}";
                $this->log('update', 'restaurant_reservations', $old, $new);
                return response()->json(["se ha cambiado correctamente " . implode(", ", $cambios)]);
            }

            return response()->json([""]);
        } catch (\Exception $e) {
            return response()->json(
                ["ha habido un error ha la hora de editar la reserva, introduce correctamente los campos"]
                , 400);
        }
    }

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
            $old = "user_id: {$restReserva->user_id}, restaurant_id: {$restReserva->restaurant_id}, date: {$restReserva->reservation_date}, status: {$restReserva->status}";
            $restReserva->delete();
            $this->log('delete', 'restaurant_reservations', $old, '');
        } catch (\Exception $e) {
            return response()->json(["no se ha podido eliminar la reserva, por favor, intentelo mas tarde"]);
        }

        return response()->json(["se ha borrado correctamente la reserva"]);
    }

    public function editStatus(Request $request, $id)
    {
        try {
            $request->validate([
                "status" => "required|in:pending,accepted,checked_in,late,no_show,cancelled,completed"
            ]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }

        try {
            $reservation = Restaurant_reservation::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(["No se ha encontrado la reserva"], 400);
        }

        $this->authorize('update', $reservation);
        try {
            $old = "status: {$reservation->status}";
            $reservation->status = $request->status;
            $reservation->save();

            $this->log('update', 'restaurant_reservations', $old, "status: {$request->status}");

            return response()->json(["Estado actualizado correctamente"]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }
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
            $message = $disponibles <= 0
                ? "El establecimiento está lleno en esta franja horaria, pruebe con otra hora."
                : "No hay suficientes espacio en el establecimiento para dicha reserva, ahora mismo solo quedan {$disponibles} plazas para esta franja horaria.";

            return response()->json(["message" => $message], 422);
        }

        return null;
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
