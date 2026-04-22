{{--<!DOCTYPE html>--}}
{{--<html>--}}
{{--    <head>--}}
{{--        <meta charset="utf-8"/>--}}
{{--        <style>--}}
{{--            body {--}}
{{--                font-family: sans-serif;--}}
{{--                margin: 0;--}}
{{--                padding: 30px;--}}
{{--                color: #1e293b;--}}
{{--            }--}}
{{--            .ticket {--}}
{{--                border: 2px solid #005696;--}}
{{--                border-radius: 12px;--}}
{{--                padding: 30px;--}}
{{--                max-width: 500px;--}}
{{--                margin: 0 auto;--}}
{{--            }--}}
{{--            .header {--}}
{{--                text-align: center;--}}
{{--                border-bottom: 1px solid #e2e8f0;--}}
{{--                padding-bottom: 20px;--}}
{{--                margin-bottom: 20px;--}}
{{--            }--}}
{{--            .header h1 {--}}
{{--                color: #005696;--}}
{{--                font-size: 24px;--}}
{{--                margin: 0 0 5px 0;--}}
{{--            }--}}
{{--            .header p {--}}
{{--                color: #FF7E54;--}}
{{--                margin: 0;--}}
{{--                font-size: 13px;--}}
{{--            }--}}
{{--            .info-row {--}}
{{--                display: flex;--}}
{{--                justify-content: space-between;--}}
{{--                margin-bottom: 10px;--}}
{{--                font-size: 14px;--}}
{{--            }--}}
{{--            .label { color: #64748b; }--}}
{{--            .value { font-weight: bold; }--}}
{{--            .qr {--}}
{{--                text-align: center;--}}
{{--                margin-top: 25px;--}}
{{--                padding-top: 20px;--}}
{{--                border-top: 1px dashed #cbd5e1;--}}
{{--            }--}}
{{--            .qr p {--}}
{{--                font-size: 11px;--}}
{{--                color: #94a3b8;--}}
{{--                letter-spacing: 2px;--}}
{{--                margin-top: 8px;--}}
{{--            }--}}
{{--        </style>--}}
{{--    </head>--}}
{{--    <body>--}}
{{--        <div class="ticket">--}}

{{--            <div class="header">--}}
{{--                <h1>Mundo Marino El Arrecife</h1>--}}
{{--                <p>Entrada al Parque</p>--}}
{{--            </div>--}}

{{--            <div class="info-row">--}}
{{--                <span class="label">Reserva:</span>--}}
{{--                <span class="value">#{{ $reservation->id }}</span>--}}
{{--            </div>--}}
{{--            <div class="info-row">--}}
{{--                <span class="label">Titular:</span>--}}
{{--                <span class="value">{{ $reservation->user->name }}</span>--}}
{{--            </div>--}}
{{--            <div class="info-row">--}}
{{--                <span class="label">Fecha:</span>--}}
{{--                <span class="value">{{ $reservation->reservation_date }}</span>--}}
{{--            </div>--}}
{{--            <div class="info-row">--}}
{{--                <span class="label">Adultos:</span>--}}
{{--                <span class="value">{{ $reservation->adults }}</span>--}}
{{--            </div>--}}
{{--            <div class="info-row">--}}
{{--                <span class="label">Niños:</span>--}}
{{--                <span class="value">{{ $reservation->child }}</span>--}}
{{--            </div>--}}

{{--            <div class="qr">--}}
{{--                <img src="data:image/svg+xml;base64,{{ $qr }}"--}}
{{--                     style="width:200px;height:200px;"/>--}}
{{--                <p>SCAN ME</p>--}}
{{--            </div>--}}

{{--        </div>--}}
{{--    </body>--}}
{{--</html>--}}
    <!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8"/>
        <title>Voucher #{{ $reservation->id }} – Mundo Marino</title>
        <style>
            /* ── Reset & base ── */
            * { margin: 0; padding: 0; box-sizing: border-box; }

            body {
                font-family: Arial, Helvetica, sans-serif;
                font-size: 11px;
                color: #0f172a;
                background: #ffffff;
            }

            /* ── Página A4 ── */
            @page {
                size: A4 portrait;
                margin: 0;
            }

            /* ── Encabezado ── */
            .header {
                background-color: #0f172a;
                padding: 36px 48px 32px;
            }
            .header-table {
                width: 100%;
            }
            .brand-name {
                font-family: Georgia, serif;
                font-size: 24px;
                font-weight: 700;
                color: #ffffff;
                letter-spacing: -0.5px;
            }
            .brand-dot {
                color: #f97415;
            }
            .brand-subtitle {
                font-size: 8px;
                font-weight: 700;
                letter-spacing: 3px;
                text-transform: uppercase;
                color: #94a3b8;
                margin-top: 4px;
            }
            .res-id-label {
                font-size: 8px;
                font-weight: 700;
                letter-spacing: 3px;
                text-transform: uppercase;
                color: #94a3b8;
                text-align: right;
            }
            .res-id-value {
                font-family: 'Courier New', Courier, monospace;
                font-size: 18px;
                font-weight: 700;
                color: #ffffff;
                text-align: right;
                margin-top: 4px;
            }

            /* ── Franja naranja ── */
            .accent-bar {
                height: 4px;
                background-color: #f97415;
                width: 100%;
            }

            /* ── Cuerpo ── */
            .body-wrap {
                padding: 36px 48px;
            }

            /* Etiquetas */
            .field-label {
                font-size: 8px;
                font-weight: 700;
                letter-spacing: 2.5px;
                text-transform: uppercase;
                color: #64748b;
                margin-bottom: 3px;
            }
            .field-value-lg {
                font-family: Georgia, serif;
                font-size: 18px;
                font-weight: 700;
                color: #0f172a;
            }
            .field-value {
                font-size: 13px;
                font-weight: 700;
                color: #0f172a;
            }

            /* ── Grid 2 columnas ── */
            .grid-2 {
                width: 100%;
            }
            .grid-2 td {
                width: 50%;
                vertical-align: top;
            }
            .grid-2 .col-right {
                padding-left: 20px;
            }

            /* ── Separador punteado ── */
            .divider {
                border: none;
                border-top: 1.5px dashed #e2e8f0;
                margin: 20px 0;
            }

            /* ── Caja resumen ── */
            .summary-box {
                background-color: #f8fafc;
                border-radius: 6px;
                padding: 20px 24px;
                margin-top: 24px;
                margin-bottom: 28px;
            }
            .summary-title {
                font-size: 8px;
                font-weight: 700;
                letter-spacing: 2.5px;
                text-transform: uppercase;
                color: #64748b;
                margin-bottom: 14px;
            }
            .summary-table {
                width: 100%;
                border-collapse: collapse;
            }
            .summary-table thead th {
                font-size: 8px;
                font-weight: 700;
                letter-spacing: 2px;
                text-transform: uppercase;
                color: #94a3b8;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 8px;
            }
            .summary-table tbody td {
                font-size: 12px;
                color: #475569;
                font-weight: 500;
                padding: 8px 0;
                border-bottom: 1px solid #f1f5f9;
            }
            .summary-table .tax-row td {
                font-size: 11px;
                color: #94a3b8;
                font-weight: 400;
                border-bottom: none;
            }
            .summary-table .total-row td {
                font-size: 15px;
                font-weight: 700;
                color: #0f172a;
                padding-top: 10px;
                border-bottom: none;
            }

            /* ── Instrucciones ── */
            .instructions-table {
                width: 100%;
                margin-bottom: 32px;
            }
            .instructions-table td {
                width: 33.33%;
                vertical-align: top;
                padding-right: 16px;
            }
            .instructions-table td:last-child {
                padding-right: 0;
            }
            .inst-title {
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #0f172a;
                margin-bottom: 4px;
                margin-top: 4px;
            }
            .inst-text {
                font-size: 10px;
                color: #64748b;
                line-height: 1.5;
            }
            .inst-icon {
                font-size: 16px;
                color: #cbd5e1;
            }

            /* ── Footer ── */
            .footer {
                background-color: #f8fafc;
                border-top: 1px solid #e2e8f0;
                padding: 24px 48px;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
            }
            .footer-table {
                width: 100%;
            }
            .terms-title {
                font-size: 8px;
                font-weight: 700;
                letter-spacing: 2.5px;
                text-transform: uppercase;
                color: #94a3b8;
                margin-bottom: 5px;
            }
            .terms-text {
                font-size: 9px;
                color: #94a3b8;
                line-height: 1.6;
                max-width: 340px;
            }
            .support-label {
                font-size: 8px;
                font-weight: 700;
                letter-spacing: 2px;
                text-transform: uppercase;
                color: #94a3b8;
                text-align: right;
            }
            .support-text {
                font-size: 10px;
                color: #64748b;
                line-height: 1.8;
                text-align: right;
            }
            .copyright {
                font-size: 9px;
                color: #94a3b8;
                font-style: italic;
                text-align: right;
                margin-top: 10px;
            }

            /* Wrapper page */
            .page-wrap {
                position: relative;
                min-height: 297mm;
                width: 210mm;
                margin: 0 auto;
                background: #ffffff;
            }
        </style>
    </head>
    <body>
        <div class="page-wrap">

            <!-- ══ ENCABEZADO ══ -->
            <div class="header">
                <table class="header-table" cellpadding="0" cellspacing="0">
                    <tr>
                        <td>
                            <div class="brand-name">Mundo<span class="brand-dot">.</span>Marino</div>
                            <div class="brand-subtitle">Voucher Oficial de Reserva</div>
                        </td>
                        <td style="text-align: right; vertical-align: bottom;">
                            <div class="res-id-label">N.º de Reserva</div>
                            <div class="res-id-value">#{{ $reservation->id }}</div>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Franja naranja -->
            <div class="accent-bar"></div>

            <!-- ══ CUERPO ══ -->
            <div class="body-wrap">

                <!-- Titular + Experiencia -->
                <table class="grid-2" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                    <tr>
                        <td>
                            <div class="field-label">Titular</div>
                            <div class="field-value-lg">{{ $reservation->user->name }}</div>
                        </td>
                        <td class="col-right">
                            <div class="field-label">Tipo de Experiencia</div>
                            <div class="field-value-lg">{{ $reservation->type ?? 'Pase de Verano Combo' }}</div>
                        </td>
                    </tr>
                </table>

                <hr class="divider"/>

                <!-- Fecha + Hora -->
                <table class="grid-2" cellpadding="0" cellspacing="0" style="margin-bottom: 4px;">
                    <tr>
                        <td>
                            <div class="field-label">Fecha de Visita</div>
                            <div class="field-value">{{ \Carbon\Carbon::parse($reservation->reservation_date)->translatedFormat('d \d\e F \d\e Y') }}</div>
                        </td>
                        <td class="col-right">
                            <div class="field-label">Hora de Entrada</div>
                            <div class="field-value">{{ $reservation->entry_time ?? '10:30 AM' }}</div>
                        </td>
                    </tr>
                </table>

                <!-- ══ RESUMEN ══ -->
                @php
                    $adultPrice = $reservation->adults * ($reservation->adult_price_total ?? 15);
                    $childPrice = $reservation->child  * ($reservation->child_price_total  ?? 8);
                    $subtotal   = $adultPrice + $childPrice;
                    $taxes      = $subtotal * 0.08;
                    $total      = $subtotal + $taxes;
                @endphp

                <div class="summary-box">
                    <div class="summary-title">Resumen de la Reserva</div>
                    <table class="summary-table" cellpadding="0" cellspacing="0">
                        <thead>
                            <tr>
                                <th style="text-align: left;">Descripción</th>
                                <th style="text-align: center;">Cantidad</th>
                                <th style="text-align: right;">Importe</th>
                            </tr>
                        </thead>
                        <tbody>
                            @if($reservation->adults > 0)
                                <tr>
                                    <td>Entrada Adulto</td>
                                    <td style="text-align: center;">{{ $reservation->adults }}</td>
                                    <td style="text-align: right;">${{ number_format($adultPrice, 2) }}</td>
                                </tr>
                            @endif

                            @if($reservation->child > 0)
                                <tr>
                                    <td>Entrada Niño</td>
                                    <td style="text-align: center;">{{ $reservation->child }}</td>
                                    <td style="text-align: right;">${{ number_format($childPrice, 2) }}</td>
                                </tr>
                            @endif

                            <tr class="tax-row">
                                <td>Impuestos (8%)</td>
                                <td></td>
                                <td style="text-align: right;">${{ number_format($taxes, 2) }}</td>
                            </tr>
                            <tr class="total-row">
                                <td>Total Pagado</td>
                                <td></td>
                                <td style="text-align: right;">${{ number_format($total, 2) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- ══ INSTRUCCIONES ══ -->
                <table class="instructions-table" cellpadding="0" cellspacing="0">
                    <tr>
                        <td>
                            <div class="inst-icon">&#127915;</div>
                            <div class="inst-title">Digital o Impreso</div>
                            <div class="inst-text">Presente este voucher en formato digital o impreso en la entrada principal.</div>
                        </td>
                        <td>
                            <div class="inst-icon">&#128336;</div>
                            <div class="inst-title">Puntualidad</div>
                            <div class="inst-text">Llegue al menos 15 minutos antes de su horario programado.</div>
                        </td>
                        <td>
                            <div class="inst-icon">&#129439;</div>
                            <div class="inst-title">Identificación</div>
                            <div class="inst-text">Se podrá solicitar un documento de identidad válido a nombre del titular.</div>
                        </td>
                    </tr>
                </table>

            </div><!-- /body-wrap -->

            <!-- ══ FOOTER ══ -->
            <div class="footer">
                <table class="footer-table" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="vertical-align: top; width: 60%;">
                            <div class="terms-title">Términos y Condiciones</div>
                            <div class="terms-text">
                                Este voucher es válido únicamente para la fecha y hora indicadas. Sin reembolso si se cancela dentro de las 48 horas previas. Mundo Marino se reserva el derecho de modificar los horarios por razones de bienestar animal o seguridad. No se permite fotografía profesional sin autorización previa.
                            </div>
                        </td>
                        <td style="vertical-align: top; text-align: right; width: 40%;">
                            <div class="support-label">Soporte</div>
                            <div class="support-text">
                                help@mundomarino.com.ar<br/>
                                +54 2252 42-1071
                            </div>
                            <div class="copyright">© {{ date('Y') }} Mundo Marino Oceanarium.</div>
                        </td>
                    </tr>
                </table>
            </div>

        </div><!-- /page-wrap -->
    </body>
</html>
