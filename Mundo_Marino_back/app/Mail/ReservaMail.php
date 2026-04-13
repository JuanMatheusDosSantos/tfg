<?php

namespace App\Mail;

use Illuminate\Mail\Mailables\Attachment;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class ReservaMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public $reservation,
        public string $tipo // 'parque' o 'restaurante'
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tu entrada - Mundo Marino El Arrecife',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        // Vista diferente según el tipo
        return new Content(
            view: $this->tipo === 'parque'
                ? 'emails.entrada_parque'
                : 'emails.entrada_restaurante',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */

    public function attachments(): array
    {
        \Log::info('ReservaMail tipo: ' . $this->tipo);
        // Solo el parque lleva PDF con QR
        if ($this->tipo === 'restaurante') {
            $pdf = Pdf::loadView('pdfs.entrada_restaurante', [
                'reservation' => $this->reservation,
            ]);

            return [
                Attachment::fromData(
                    fn () => $pdf->output(),
                    'reserva-restaurante-'.$this->reservation->id.'.pdf'
                )->withMime('application/pdf')
            ];
        }

        $qrSvg = base64_encode(QrCode::size(200)->generate($this->reservation->codigo_qr));
        $pdf = Pdf::loadView('pdfs.entrada', [
            'reservation' => $this->reservation,
            'qrSvg'       => $qrSvg
        ]);

        return [
            Attachment::fromData(
                fn () => $pdf->output(),
                'entrada'.$this->reservation->id.'.pdf'
            )->withMime('application/pdf')
        ];
    }

}
