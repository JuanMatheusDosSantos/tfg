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
{{--        </style>--}}
{{--    </head>--}}
{{--    <body>--}}
{{--        <div class="ticket">--}}

{{--            <div class="header">--}}
{{--                <h1>Mundo Marino El Arrecife</h1>--}}
{{--                <p>Reserva en el Restaurante</p>--}}
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
{{--                <span class="label">Hora:</span>--}}
{{--                <span class="value">{{ \Carbon\Carbon::parse($reservation->reservation_hour)->format('H:i') }}</span>--}}
{{--            </div>--}}
{{--            <div class="info-row">--}}
{{--                <span class="label">Personas:</span>--}}
{{--                <span class="value">{{ $reservation->party_size }}</span>--}}
{{--            </div>--}}
{{--            <div class="info-row">--}}
{{--                <span class="label">Restaurante:</span>--}}
{{--                <span class="value">{{ $reservation->restaurant->name ?? 'El Arrecife' }}</span>--}}
{{--            </div>--}}

{{--        </div>--}}
{{--    </body>--}}
{{--</html>--}}


    <!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8"/>
        <title>Voucher Restaurante #{{ $reservation->id }} – Mundo Marino</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: Arial, Helvetica, sans-serif;
                font-size: 11px;
                color: #0f172a;
                background: #ffffff;
            }

            @page {
                size: A4 portrait;
                margin: 0;
            }

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

            .accent-bar {
                height: 4px;
                background-color: #f97415;
                width: 100%;
            }

            .body-wrap {
                padding: 36px 48px;
            }

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

            .divider {
                border: none;
                border-top: 1.5px dashed #e2e8f0;
                margin: 20px 0;
            }

            /* ── Badge de estado ── */
            .status-badge {
                display: inline-block;
                padding: 3px 10px;
                border-radius: 20px;
                font-size: 9px;
                font-weight: 700;
                letter-spacing: 1.5px;
                text-transform: uppercase;
            }

            .status-pending   { background: #fef9c3; color: #854d0e; }
            .status-accepted  { background: #dcfce7; color: #166534; }
            .status-cancelled { background: #fee2e2; color: #991b1b; }
            .status-completed { background: #e0f2fe; color: #075985; }
            .status-checked_in{ background: #f0fdf4; color: #15803d; }
            .status-no_show   { background: #fce7f3; color: #9d174d; }
            .status-late      { background: #fff7ed; color: #c2410c; }

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

            .summary-table tbody td {
                font-size: 12px;
                color: #475569;
                font-weight: 500;
                padding: 8px 0;
                border-bottom: 1px solid #f1f5f9;
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
                            <div class="brand-subtitle">Reserva de Restaurante</div>
                        </td>
                        <td style="text-align: right; vertical-align: bottom;">
                            <div class="res-id-label">N.º de Reserva</div>
                            <div class="res-id-value">#{{ str_pad($reservation->id, 7, '0', STR_PAD_LEFT) }}</div>
                        </td>
                    </tr>
                </table>
            </div>

            <div class="accent-bar"></div>

            <!-- ══ CUERPO ══ -->
            <div class="body-wrap">

                <!-- Titular + Restaurante -->
                <table class="grid-2" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                    <tr>
                        <td>
                            <div class="field-label">Titular</div>
                            <div class="field-value-lg">{{ $reservation->user->name }}</div>
                        </td>
                        <td class="col-right">
                            <div class="field-label">Restaurante</div>
                            <div class="field-value-lg">{{ $reservation->restaurant->name }}</div>
                        </td>
                    </tr>
                </table>

                <hr class="divider"/>

                <!-- Fecha + Hora -->
                <table class="grid-2" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                    <tr>
                        <td>
                            <div class="field-label">Fecha de Reserva</div>
                            <div class="field-value">
                                {{ \Carbon\Carbon::parse($reservation->reservation_date)->translatedFormat('d \d\e F \d\e Y') }}
                            </div>
                        </td>
                        <td class="col-right">
                            <div class="field-label">Hora</div>
                            <div class="field-value">
                                {{ \Carbon\Carbon::parse($reservation->reservation_hour)->format('H:i') }}
                            </div>
                        </td>
                    </tr>
                </table>

                <hr class="divider"/>

                <!-- Comensales + Estado -->
                <table class="grid-2" cellpadding="0" cellspacing="0" style="margin-bottom: 4px;">
                    <tr>
                        <td>
                            <div class="field-label">Número de Comensales</div>
                            <div class="field-value">{{ $reservation->party_size }} persona{{ $reservation->party_size > 1 ? 's' : '' }}</div>
                        </td>
                        <td class="col-right">
                            <div class="field-label">Estado</div>
                            <div style="margin-top: 3px;">
                                <span class="status-badge status-{{ $reservation->status }}">
                                    {{ ucfirst(str_replace('_', ' ', $reservation->status)) }}
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>

                <!-- ══ RESUMEN ══ -->
                <div class="summary-box">
                    <div class="summary-title">Detalle de la Reserva</div>
                    <table class="summary-table" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td>Restaurante</td>
                                <td style="text-align: right;">{{ $reservation->restaurant->name }}</td>
                            </tr>
                            <tr>
                                <td>Fecha</td>
                                <td style="text-align: right;">
                                    {{ \Carbon\Carbon::parse($reservation->reservation_date)->translatedFormat('d \d\e F \d\e Y') }}
                                </td>
                            </tr>
                            <tr>
                                <td>Hora</td>
                                <td style="text-align: right;">
                                    {{ \Carbon\Carbon::parse($reservation->reservation_hour)->format('H:i') }}
                                </td>
                            </tr>
                            <tr class="total-row">
                                <td>Comensales</td>
                                <td style="text-align: right;">{{ $reservation->party_size }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- ══ INSTRUCCIONES ══ -->
                <table class="instructions-table" cellpadding="0" cellspacing="0">
                    <tr>
                        <td>
                            <div class="inst-icon">&#127869;</div>
                            <div class="inst-title">Presenta este Voucher</div>
                            <div class="inst-text">Muestra este documento en formato digital o impreso al llegar al restaurante.</div>
                        </td>
                        <td>
                            <div class="inst-icon">&#128336;</div>
                            <div class="inst-title">Puntualidad</div>
                            <div class="inst-text">La mesa se mantendrá reservada durante 15 minutos tras la hora indicada.</div>
                        </td>
                        <td>
                            <div class="inst-icon">&#128222;</div>
                            <div class="inst-title">Cancelaciones</div>
                            <div class="inst-text">Para cancelar o modificar, contacta con al menos 2 horas de antelación.</div>
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
                                Esta reserva es válida únicamente para la fecha y hora indicadas. La mesa se liberará pasados 15 minutos de la hora de reserva sin aviso previo. Mundo Marino se reserva el derecho de modificar la disponibilidad por causas de fuerza mayor. Para grupos de más de 10 personas se requiere confirmación previa.
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
