<?php

namespace App\Mail;

use App\Models\Park_reservation;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PagoRecibidoMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */

    public function __construct(
        public Park_reservation $reservation,
        public User $usuario,
        public float $amount
    ) {}
    public function build()
    {
        return $this->subject('Nuevo pago recibido - #MM-' . str_pad($this->reservation->id, 7, '0', STR_PAD_LEFT))
            ->view('emails.pago_recibido');
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
