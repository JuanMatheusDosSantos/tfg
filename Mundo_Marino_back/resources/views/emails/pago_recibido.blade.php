<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .header { background:#005696; color:white; padding:20px; text-align:center; }
            .content { padding:20px; }
            .amount { font-size:2rem; font-weight:bold; color:#FF7E54; }
            .detail { background:#f8f9fa; padding:15px; border-radius:8px; margin:15px 0; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>💰 Nuevo Pago Recibido</h1>
        </div>
        <div class="content">
            <p>Se ha procesado un nuevo pago en <strong>Mundo Marino El Arrecife</strong>.</p>

            <div class="detail">
                <p><strong>Referencia:</strong> #MM-{{ str_pad($reservation->id, 7, '0', STR_PAD_LEFT) }}</p>
                <p><strong>Usuario:</strong> {{ $usuario->name }} ({{ $usuario->email }})</p>
                <p><strong>Fecha reserva:</strong> {{ $reservation->reservation_date }}</p>
                <p><strong>Adultos:</strong> {{ $reservation->adults }} · <strong>Niños:</strong> {{ $reservation->child }}</p>
                <p class="amount">{{ number_format($amount, 2) }} €</p>
            </div>

            <p style="color:#666; font-size:0.85rem;">Este es un mensaje automático del sistema de pagos.</p>
        </div>
    </body>
</html>
