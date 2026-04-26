<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Admin_log;
use App\Models\Park;
use App\Models\Park_reservation;
use App\Models\Park_reservationPrice;
use App\Models\Park_reservationType;
use App\Models\Tax;
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
$this->authorize("create", Park_reservation::class);
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


    public function edit(Request $request, $id)
    {
        try {
            $request->validate([
                "reservation_date"        => "required|date|after_or_equal:today",
                "adults"                  => "required|integer|min:1",
                "child"                   => "required|integer|min:0",
                "status"                  => "required|in:checked_in,late,no_show,cancelled,completed,pending,paid",
                "tax_id"                  => "required|exists:taxes,id",
                "park_reservation_type_id"=> "required|exists:park_reservation_types,id",
            ]);
        } catch (\Exception $e) {
            return response()->json(["message" => "Error de validación: " . $e->getMessage()], 400);
        }

        try {
            $reservation = Park_reservation::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(["message" => "Reserva no encontrada"], 404);
        }
$this->authorize("update",$reservation);
        try {
            $tax  = Tax::findOrFail($request->tax_id);

            $viejo_total = (float)$reservation->adult_price_total + (float)$reservation->child_price_total;

            $precio = Park_reservationPrice::where('park_reservation_type_id', $request->park_reservation_type_id)
                ->where('park_id', $reservation->park_id)
                ->firstOrFail();

            $nuevo_adult_price_total = (float)$precio->adult_price * $request->adults;
            $nuevo_child_price_total = (float)$precio->child_price * $request->child;
            $nuevo_total = $nuevo_adult_price_total + $nuevo_child_price_total;

            if (($nuevo_total - $viejo_total) < -0.01) {
                return response()->json([
                    "message" => "No puedes reducir el importe de la reserva. Si deseas cancelarla, cambia el estado a 'cancelled'."
                ], 400);
            }

            $old = [];
            $new = [];
            $cambios = [];

            if ($reservation->reservation_date != $request->reservation_date) {
                $old['fecha'] = $reservation->reservation_date;
                $reservation->reservation_date = $request->reservation_date;
                $new['fecha'] = $reservation->reservation_date;
                $cambios[] = "fecha";
            }
            if ($reservation->adults != $request->adults) {
                $old['adults'] = $reservation->adults;
                $reservation->adults = $request->adults;
                $new['adults'] = $reservation->adults;
                $cambios[] = "adultos";
            }
            if ($reservation->child != $request->child) {
                $old['child'] = $reservation->child;
                $reservation->child = $request->child;
                $new['child'] = $reservation->child;
                $cambios[] = "niños";
            }
            if ($reservation->status != $request->status) {
                $old['status'] = $reservation->status;
                $reservation->status = $request->status;
                $new['status'] = $reservation->status;
                $cambios[] = "estado";
            }
            if ($reservation->tax_id != $request->tax_id) {
                $old['tax_id'] = $reservation->tax_id;
                $reservation->tax_id = $request->tax_id;
                $reservation->applied_tax = $tax->percentage;
                $new['tax_id'] = $reservation->tax_id;
                $cambios[] = "impuesto";
            }
            if ($reservation->park_reservation_type_id != $request->park_reservation_type_id) {
                $old['park_reservation_type_id'] = $reservation->park_reservation_type_id;
                $reservation->park_reservation_type_id = $request->park_reservation_type_id;
                $new['park_reservation_type_id'] = $reservation->park_reservation_type_id;
                $cambios[] = "tipo de reserva";
            }

            if (in_array("adultos", $cambios) || in_array("niños", $cambios) || in_array("tipo de reserva", $cambios)) {
                if ($reservation->adult_price_total != $nuevo_adult_price_total) {
                    $old['adult_price_total'] = $reservation->adult_price_total;
                    $new['adult_price_total'] = $nuevo_adult_price_total;
                }
                if ($reservation->child_price_total != $nuevo_child_price_total) {
                    $old['child_price_total'] = $reservation->child_price_total;
                    $new['child_price_total'] = $nuevo_child_price_total;
                }

                $reservation->adult_price_total = $nuevo_adult_price_total;
                $reservation->child_price_total = $nuevo_child_price_total;
                $cambios[] = "precios";
            }

            if (count($cambios) === 0) {
                return response()->json(["message" => "No se han detectado cambios"]);
            }

            $reservation->save();

            $this->log('update', 'park_reservations', json_encode($old), json_encode($new));

            return response()->json(["message" => "Se ha cambiado correctamente: " . implode(", ", $cambios)]);

        } catch (\Exception $e) {
            return response()->json(["message" => "Error al editar la reserva: "
//                    . $e->getMessage()
                ]
                , 400);
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
        $this->authorize("update",$reservation);
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
    public function delete($id)
    {
        try {
            $restReserva = Park_reservation::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(["no se ha podido encontrar la reserva, por favor, revise la reserva"], 400);
        }
        $this->authorize("delete", $restReserva);
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
