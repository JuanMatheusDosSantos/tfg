<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <style>
            body {
                font-family: sans-serif;
                margin: 0;
                padding: 30px;
                color: #1e293b;
            }
            .ticket {
                border: 2px solid #005696;
                border-radius: 12px;
                padding: 30px;
                max-width: 500px;
                margin: 0 auto;
            }
            .header {
                text-align: center;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 20px;
                margin-bottom: 20px;
            }
            .header h1 {
                color: #005696;
                font-size: 24px;
                margin: 0 0 5px 0;
            }
            .header p {
                color: #FF7E54;
                margin: 0;
                font-size: 13px;
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                font-size: 14px;
            }
            .label { color: #64748b; }
            .value { font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="ticket">

            <div class="header">
                <h1>Mundo Marino El Arrecife</h1>
                <p>Reserva en el Restaurante</p>
            </div>

            <div class="info-row">
                <span class="label">Reserva:</span>
                <span class="value">#{{ $reservation->id }}</span>
            </div>
            <div class="info-row">
                <span class="label">Titular:</span>
                <span class="value">{{ $reservation->user->name }}</span>
            </div>
            <div class="info-row">
                <span class="label">Fecha:</span>
                <span class="value">{{ $reservation->reservation_date }}</span>
            </div>
            <div class="info-row">
                <span class="label">Hora:</span>
                <span class="value">{{ \Carbon\Carbon::parse($reservation->reservation_hour)->format('H:i') }}</span>
            </div>
            <div class="info-row">
                <span class="label">Personas:</span>
                <span class="value">{{ $reservation->party_size }}</span>
            </div>
            <div class="info-row">
                <span class="label">Restaurante:</span>
                <span class="value">{{ $reservation->restaurant->name ?? 'El Arrecife' }}</span>
            </div>

        </div>
    </body>
</html>
