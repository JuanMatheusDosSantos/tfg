<!DOCTYPE html>
<html>
    <body style="font-family:sans-serif; color:#1e293b; padding:30px;">

        <h2 style="color:#005696;">¡Tu entrada está lista!</h2>

        <p>Hola <strong>{{ $reservation->user->name }}</strong>,</p>

        <p>Adjuntamos tu entrada en PDF para el <strong>{{ $reservation->reservation_date }}</strong>.</p>

        <table style="width:100%; border-collapse:collapse; margin:20px 0;">
            <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:10px; color:#64748b;">Fecha:</td>
                <td style="padding:10px; font-weight:bold;">{{ $reservation->reservation_date }}</td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:10px; color:#64748b;">Adultos:</td>
                <td style="padding:10px; font-weight:bold;">{{ $reservation->adults }}</td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:10px; color:#64748b;">Niños:</td>
                <td style="padding:10px; font-weight:bold;">{{ $reservation->child }}</td>
            </tr>
        </table>

        <p>Recuerda mostrar el código QR adjunto en la entrada del parque.</p>

        <p style="color:#94a3b8; font-size:12px; margin-top:30px;">
            Este es un email automático, por favor no respondas a este mensaje.
        </p>

    </body>
</html>
