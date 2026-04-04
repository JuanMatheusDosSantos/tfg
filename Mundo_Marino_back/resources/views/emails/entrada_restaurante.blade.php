<!DOCTYPE html>
<html>
    <body style="font-family:sans-serif; color:#1e293b; padding:30px;">

        <h2 style="color:#005696;">¡Reserva confirmada!</h2>

        <p>Hola <strong>{{ $reservation->user->name }}</strong>,</p>

        <p>Tu reserva en el restaurante ha sido confirmada con los siguientes detalles:</p>

        <table style="width:100%; border-collapse:collapse; margin:20px 0;">
            <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:10px; color:#64748b;">Fecha:</td>
                <td style="padding:10px; font-weight:bold;">{{ $reservation->reservation_date }}</td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:10px; color:#64748b;">Hora:</td>
                <td style="padding:10px; font-weight:bold;">{{ $reservation->reservation_hour }}</td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:10px; color:#64748b;">Personas:</td>
                <td style="padding:10px; font-weight:bold;">{{ $reservation->party_size }}</td>
            </tr>
        </table>

        <p>Nos vemos pronto en <strong style="color:#FF7E54;">Mundo Marino El Arrecife</strong>.</p>

        <p style="color:#94a3b8; font-size:12px; margin-top:30px;">
            Este es un email automático, por favor no respondas a este mensaje.
        </p>

    </body>
</html>
