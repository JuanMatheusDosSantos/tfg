<?php

namespace App\Http\Controllers;

use App\Models\Park;
use App\Models\Park_reservation;
use App\Models\Park_reservationPrice;
use App\Models\Tax;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class Park_reservationController extends Controller
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
    public function userReservation()
    {
        try {
            $userID=Auth::id();
            $parks=Park_reservation::where("user_id",$userID)->with("user")->get();
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
                "user_id"                  => "required|exists:users,id",
                "park_id"                  => "required|exists:parks,id",
                "reservation_date"         => "required|date",
                "adults"                   => "required|integer",
                "child"                    => "nullable|integer",
                "tax_id"                   => "required|exists:taxes,id",
                "park_reservation_type_id" => "required|exists:park_reservation_types,id",
                "adult_price_total"        => "required|numeric",
                "child_price_total"        => "required|numeric",
                "applied_tax"              => "required|numeric",
            ]);
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 400);
        }

        try {
            Park_reservation::create([
                "user_id"                  => $request->user_id,
                "park_id"                  => $request->park_id,
                "reservation_date"         => $request->reservation_date,
                "adults"                   => $request->adults,
                "child"                    => $request->child ?? 0,
                "codigo_qr"                => \Str::uuid(),
                "status"                   => "pending",
                "tax_id"                   => $request->tax_id,
                "park_reservation_type_id" => $request->park_reservation_type_id,
                "adult_price_total"        => $request->adult_price_total,
                "child_price_total"        => $request->child_price_total,
                "applied_tax"              => $request->applied_tax,
            ]);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 400);
        }

        return response()->json(["message" => "se ha guardado correctamente"], 200);
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
                "reservation_date"         => "required|date|after_or_equal:today",
                "adults"                   => "required|integer|min:1",
                "child"                    => "required|integer|min:0",
                "status"                   => "required|in:checked_in,late,no_show,cancelled,completed,pending,paid",
                "tax_id"                   => "required|exists:taxes,id",
                "park_reservation_type_id" => "required|exists:park_reservation_types,id",
            ]);
        } catch (\Exception $e) {
            return response()->json(["message" => "Error de validación: " . $e->getMessage()], 400);
        }

        try {
            $reservation = Park_reservation::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(["message" => "Reserva no encontrada"], 404);
        }

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

                $cambios = [];

            if ($reservation->reservation_date != $request->reservation_date) {
                $reservation->reservation_date = $request->reservation_date;
                $cambios[] = "fecha";
            }
            if ($reservation->adults != $request->adults) {
                $reservation->adults = $request->adults;
                $cambios[] = "adultos";
            }
            if ($reservation->child != $request->child) {
                $reservation->child = $request->child;
                $cambios[] = "niños";
            }
            if ($reservation->status != $request->status) {
                $reservation->status = $request->status;
                $cambios[] = "estado";
            }
            if ($reservation->tax_id != $request->tax_id) {
                $reservation->tax_id = $request->tax_id;
                $reservation->applied_tax = $tax->percentage;
                $cambios[] = "impuesto";
            }
            if ($reservation->park_reservation_type_id != $request->park_reservation_type_id) {
                $reservation->park_reservation_type_id = $request->park_reservation_type_id;
                $cambios[] = "tipo de reserva";
            }

            if (in_array("adultos", $cambios) || in_array("niños", $cambios) || in_array("tipo de reserva", $cambios)) {
                $reservation->adult_price_total = $nuevo_adult_price_total;
                $reservation->child_price_total = $nuevo_child_price_total;
                $cambios[] = "precios";
            }

            if (count($cambios) === 0) {
                return response()->json(["message" => "No se han detectado cambios"]);
            }

            $reservation->save();

            return response()->json(["message" => "Se ha cambiado correctamente: " . implode(", ", $cambios)]);

        } catch (\Exception $e) {
            return response()->json(["message" => "Error al editar la reserva: " . $e->getMessage()], 400);
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

    public function showQR($id)
    {
        $reservation = Park_reservation::findOrFail($id);

        $qrImage = QrCode::size(200)
            ->generate($reservation->codigo_qr);  // SVG por defecto sin format()

        return response($qrImage, 200)
            ->header('Content-Type', 'image/svg+xml');
    }
    public function downloadParkReservation($id)
    {
        try {
            $reservation = Park_reservation::with('user')->findOrFail($id);

            $qrSvg = base64_encode(
                QrCode::size(200)->generate($reservation->codigo_qr)
            );

            $pdf = Pdf::loadView('pdfs.entrada', [
                'reservation' => $reservation,
                'qr'       => $qrSvg
            ]);

            return $pdf->download('entrada-'.$id.'.pdf');

        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }
    }
}
