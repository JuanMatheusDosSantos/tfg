<?php

namespace App\Http\Controllers;

use App\Models\Park_reservation;
use App\Models\Payment;
use App\Models\Tax;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Webhook;


class StripeController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }
    /**
     * Crea un PaymentIntent y lo devuelve al frontend
     */
    public function createPaymentIntent(Request $request)
    {
        try{
            $request->validate([
            'amount'                   => 'required|numeric|min:0.50',
            'adults'                   => 'required|integer|min:1',
            'child'                    => 'required|integer|min:0',
            'reservation_date'         => 'required|date',
            'park_id'                  => 'required|integer|exists:parks,id',
            'park_reservation_type_id' => 'required|integer|exists:park_reservation_types,id',
            'tax_id'                   => 'required|integer|exists:taxes,id',
            'adult_price_total'        => 'required|numeric',
            'child_price_total'        => 'required|numeric',
            'applied_tax'              => 'required|numeric',
        ]);


        $amountInCents = (int) round($request->amount * 100);

        $paymentIntent = PaymentIntent::create([
            'amount'   => $amountInCents,
            'currency' => 'eur',
            'metadata' => [
                'user_id'                  => Auth::id(),
                'park_id'                  => $request->park_id,
                'adults'                   => $request->adults,
                'child'                    => $request->child,
                'reservation_date'         => $request->reservation_date,
                'park_reservation_type_id' => $request->park_reservation_type_id,
                'tax_id'                   => $request->tax_id,
                'adult_price_total'        => $request->adult_price_total,
                'child_price_total'        => $request->child_price_total,
                'applied_tax'              => $request->applied_tax,
            ],
        ]);

        return response()->json([
            'client_secret' => $paymentIntent->client_secret,
            'payment_intent_id' => $paymentIntent->id,
        ]);
    } catch (\Stripe\Exception\ApiErrorException $e) {
\Log::channel('payments')->error('Stripe API error: ' . $e->getMessage());
return response()->json(['message' => $e->getMessage()], 500);
} catch (\Exception $e) {
    \Log::channel('payments')->error('Error createPaymentIntent: ' . $e->getMessage());
    return response()->json(['message' => $e->getMessage()], 500);
}
    }

    /**
     * Webhook de Stripe - confirma el pago y crea la reserva + payment
     */
    public function webhook(Request $request)
    {
        $payload   = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret    = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $pi       = $event->data->object;
            $metadata = $pi->metadata;

            \Log::channel('payments')->info('Webhook recibido', (array) $metadata);
            // Crear reserva de parque
            try {
            $reservation = Park_reservation::create([
                'user_id'                  => $metadata->user_id,
                'park_id'                  => $metadata->park_id,
                'reservation_date'         => $metadata->reservation_date,
                'adults'                   => $metadata->adults,
                'child'                    => $metadata->child,
                'status'                   => 'accepted',
                'codigo_qr'                => Str::uuid(),
                'tax_id'                   => $metadata->tax_id,
                'adult_price_total'        => $metadata->adult_price_total,
                'child_price_total'        => $metadata->child_price_total,
                'applied_tax'              => $metadata->applied_tax,
                'park_reservation_type_id' => $metadata->park_reservation_type_id,
            ]);
            } catch (\Exception $e) {
                \Log::channel('payments')->error('Error creando reserva: ' . $e->getMessage());
            }
            \Log::channel('payments')->info('Reserva creada', ['id' => $reservation->id]);
            // Crear registro de pago
            Payment::create([
                'user_id'   => $metadata->user_id,
                'park_id'   => $metadata->park_id,
                'date'      => $metadata->reservation_date,
                'amount'    => $pi->amount / 100,
                'method'    => 'stripe',
                'state'     => 'accepted',
                'reference' => $pi->id,
            ]);
            \Log::channel('payments')->info('Payment creado');

        }

        if ($event->type === 'payment_intent.payment_failed') {
            $pi = $event->data->object;
            \Log::channel('payments')->error('Pago fallido: ' . $pi->id);
            \Log::channel('payments')->error('Motivo: ' . ($pi->last_payment_error?->message ?? 'Desconocido'));
        }

        return response()->json(['status' => 'ok']);
    }
}
