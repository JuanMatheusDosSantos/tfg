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
            .qr {
                text-align: center;
                margin-top: 25px;
                padding-top: 20px;
                border-top: 1px dashed #cbd5e1;
            }
            .qr p {
                font-size: 11px;
                color: #94a3b8;
                letter-spacing: 2px;
                margin-top: 8px;
            }
        </style>
    </head>
    <body>
        <div class="ticket">

            <div class="header">
                <h1>Mundo Marino El Arrecife</h1>
                <p>Entrada al Parque</p>
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
                <span class="label">Adultos:</span>
                <span class="value">{{ $reservation->adults }}</span>
            </div>
            <div class="info-row">
                <span class="label">Niños:</span>
                <span class="value">{{ $reservation->child }}</span>
            </div>

            <div class="qr">
                <img src="data:image/svg+xml;base64,{{ $qr }}"
                     style="width:200px;height:200px;"/>
                <p>SCAN ME</p>
            </div>

        </div>
    </body>
</html>
