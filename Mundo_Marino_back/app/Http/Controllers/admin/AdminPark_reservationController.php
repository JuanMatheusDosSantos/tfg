<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Admin_log;
use App\Models\Park;
use App\Models\Park_reservation;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class AdminPark_reservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $parks=Park_reservation::with("user")->get();
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
//    public function store(Request $request)
//    {
//        try {
//            $request->validate([
//                "user_id" => "required|exists:users,id",
//                "park_id"=>"required|exists:parks,id",
//                "reservation_date"=>"required|date",
//                "adults"=>"required|integer",
//                "child"=>"nullable|integer"
//            ]);
//        }catch (\Exception $e){
////            return response()->json(["por favor, rellene las cosas correctamente"],400);
//            return response()->json($e->getMessage(),400);
//        }
//        try {
//            Park_reservation::create([
//                "user_id" => $request->user_id,
//                "park_id" => $request->park_id,
//                "reservation_date" => $request->reservation_date,
//                "adults" => $request->adults,
//                "child" => $request->child,
//            ]);
//        } catch (\Exception $e) {
//            return response()->json(["message" => $e->getMessage()], 400);
////            return response()->json([$request->user_id], 400);
//        }
//        return response()->json(["message" => "se ha guardado correctamente"], 200);
//    }
    public function store(Request $request)
    {
        try {
            $request->validate([
                "user_id"          => "required|exists:users,id",
                "park_id"          => "required|exists:parks,id",
                "reservation_date" => "required|date",
                "adults"           => "required|integer",
                "child"            => "nullable|integer"
            ]);
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 400);
        }

        try {
            $reservation = Park_reservation::create([
                "user_id"          => $request->user_id,
                "park_id"          => $request->park_id,
                "reservation_date" => $request->reservation_date,
                "adults"           => $request->adults,
                "child"            => $request->child,
            ]);

            $this->log('insert', 'park_reservations', '',
                "user_id: {$reservation->user_id}, park_id: {$reservation->park_id}, date: {$reservation->reservation_date}, adults: {$reservation->adults}, child: {$reservation->child}"
            );

            return response()->json(["message" => "se ha guardado correctamente"], 200);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 400);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $reservation=Park_reservation::with(["user","park"])->findOrFail($id);
            return response()->json($reservation);
        }catch (\Exception $e){
            return response()->json(["ha habido un fallo al intentar mostrar la reserva del parque"],400);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
//    public function edit(Request $request, $id)
//    {
//        try {
//            $request->validate([
//                "reservation_date" => "required|date|after_or_equal:today",
//                "max_persons" => "required|numeric|min:1",
//                "status" => "required|in:cancelled"
//            ]);
//        } catch (\Exception $e) {
//            return response()->json([
////                    $e->getMessage()
//                "ha habido un error en la validacion, introduce correctamente los campos"
//            ], 400);
//        }
//
//        try {
//            $reservation = Park_reservation::findOrFail($id);
//        } catch (\Exception $e) {
//            return response()->json(["ha habido un fallo al buscar la reserva"], 400);
//        }
//        try {
//            $cambios = [];
//            if ($reservation->reservation_date != $request->reservation_date) {
//                $reservation->reservation_date = $request->reservation_date;
//                $cambios[] = "dia de la reserva";
//            }
//            if ($reservation->max_persons != $request->max_persons) {
//                $reservation->max_persons = $request->max_persons;
//                $cambios[] = "tamaño de la reserva";
//            }
//            if ($reservation->status != $request->status) {
//                $cambios[] = "estado de la reserva";
//                $reservation->status = $request->status;
//            }
//            $reservation->save();
//            if ($cambios > 0) {
//                return response()->json(["se ha cambiado correctamente " . implode(", ", $cambios)]);
//            } else {
//                return response()->json([""]);
//            }
//        } catch (\Exception $e) {
//            return response()->json([
////                    $e->getMessage()
//                "ha habido un error ha la hora de editar la reserva, introduce correctamente los campos"
//            ], 400);
//        }
//
//    }
//    public function editStatus(Request $request, $id)
//    {
//        try {
//            $request->validate([
//                "status" => "required"
//            ]);
//        } catch (\Exception $e) {
//            return response()->json([
//                    $e->getMessage()
////                "ha habido un error en la validacion, introduce correctamente los campos"
//            ], 400);
//        }
//
//        try {
//            $reservation = Park_reservation::findOrFail($id);
//        } catch (\Exception $e) {
//            return response()->json(["ha habido un fallo al buscar la reserva"], 400);
//        }
//        try {
//            $cambios = [];
//            if ($reservation->reservation_date != $request->reservation_date&&!is_null($request->reservation_date)) {
//                $reservation->reservation_date = $request->reservation_date;
//                $cambios[] = "dia de la reserva";
//            }
//            if ($reservation->max_persons != $request->max_persons) {
//                $reservation->max_persons = $request->max_persons;
//                $cambios[] = "tamaño de la reserva";
//            }
//            if ($reservation->status != $request->status) {
//                $cambios[] = "estado de la reserva";
//                $reservation->status = $request->status;
//            }
//            $reservation->save();
//            if ($cambios > 0) {
//                return response()->json(["se ha cambiado correctamente " . implode(", ", $cambios)]);
//            } else {
//                return response()->json([""]);
//            }
//        } catch (\Exception $e) {
//            return response()->json([
//                    $e->getMessage()
////                "ha habido un error ha la hora de editar la reserva, introduce correctamente los campos"
//            ], 400);
//        }
//
//    }

    public function edit(Request $request, $id)
    {
        try {
            $request->validate([
                "reservation_date" => "required|date|after_or_equal:today",
                "max_persons"      => "required|numeric|min:1",
                "status"           => "required|in:cancelled"
            ]);
        } catch (\Exception $e) {
            return response()->json(["ha habido un error en la validacion, introduce correctamente los campos"], 400);
        }

        try {
            $reservation = Park_reservation::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(["ha habido un fallo al buscar la reserva"], 400);
        }

        try {
            $old = "date: {$reservation->reservation_date}, status: {$reservation->status}";
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
                $reservation->status = $request->status;
                $cambios[] = "estado de la reserva";
            }
            $reservation->save();

            if (count($cambios) > 0) {
                $new = "date: {$reservation->reservation_date}, status: {$reservation->status}";
                $this->log('update', 'park_reservations', $old, $new);
                return response()->json(["se ha cambiado correctamente " . implode(", ", $cambios)]);
            }

            return response()->json([""]);
        } catch (\Exception $e) {
            return response()->json(["ha habido un error ha la hora de editar la reserva"], 400);
        }
    }

    public function editStatus(Request $request, $id)
    {
        try {
            $request->validate(["status" => "required"]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }

        try {
            $reservation = Park_reservation::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(["ha habido un fallo al buscar la reserva"], 400);
        }

        try {
            $old = "date: {$reservation->reservation_date}, status: {$reservation->status}";
            $cambios = [];

            if ($reservation->reservation_date != $request->reservation_date && !is_null($request->reservation_date)) {
                $reservation->reservation_date = $request->reservation_date;
                $cambios[] = "dia de la reserva";
            }
            if ($reservation->max_persons != $request->max_persons) {
                $reservation->max_persons = $request->max_persons;
                $cambios[] = "tamaño de la reserva";
            }
            if ($reservation->status != $request->status) {
                $reservation->status = $request->status;
                $cambios[] = "estado de la reserva";
            }
            $reservation->save();

            if (count($cambios) > 0) {
                $new = "date: {$reservation->reservation_date}, status: {$reservation->status}";
                $this->log('update', 'park_reservations', $old, $new);
                return response()->json(["se ha cambiado correctamente " . implode(", ", $cambios)]);
            }

            return response()->json([""]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
//    public function delete($id)
//    {
//
//        try {
//            $restReserva = Park_reservation::findOrFail($id);
//        } catch (\Exception $e) {
//            return response()->json(["no se ha podido encontrar la reserva, por favor, revise la reserva"], 400);
//        }
//        if ($restReserva->status == "check_in") {
//            return response()->json(["no puedes borrar una reserva completa"]);
//        }
//        try {
//            $restReserva->delete();
//        } catch (\Exception $e) {
//            return response()->json(["no se ha podido eliminar la reserva, por favor, intentelo mas tarde"]);
//        }
//        return response()->json(["se ha borrado correctamente la reserva"]);
//    }
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
            $old = "user_id: {$restReserva->user_id}, park_id: {$restReserva->park_id}, date: {$restReserva->reservation_date}, status: {$restReserva->status}";
            $restReserva->delete();
            $this->log('delete', 'park_reservations', $old, '');
        } catch (\Exception $e) {
            return response()->json(["no se ha podido eliminar la reserva, por favor, intentelo mas tarde"]);
        }

        return response()->json(["se ha borrado correctamente la reserva"]);
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
