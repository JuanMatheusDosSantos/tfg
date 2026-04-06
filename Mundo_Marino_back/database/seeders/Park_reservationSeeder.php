<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class Park_reservationSeeder extends Seeder
{
    public function run(): void
    {
        // Reserva 1 - Entrada General (adulto: 15€, niño: 10€, IVA 10%)
        DB::table('park_reservations')->insert([
            [
                'id'                       => 1,
                'user_id'                  => 1,
                'park_id'                  => 1,
                'park_reservation_type_id' => 1, // Entrada General
                'reservation_date'         => '2026-02-02',
                'adults'                   => 2,
                'child'                    => 1,
                'status'                   => 'pending',
                'codigo_qr'                => Str::uuid(),
                'tax_id'                   => 1,
                'adult_price_total'        => 2 * 15.00, // 30.00
                'child_price_total'        => 1 * 10.00, // 10.00
                'applied_tax'              => 10.00,
                'created_at'               => now(),
                'updated_at'               => now(),
            ],
            // Reserva 2 - Pase VIP (adulto: 25€, niño: 18€, IVA 10%)
            [
                'id'                       => 2,
                'user_id'                  => 2,
                'park_id'                  => 1,
                'park_reservation_type_id' => 2, // Pase VIP
                'reservation_date'         => '2026-03-15',
                'adults'                   => 1,
                'child'                    => 2,
                'status'                   => 'accepted',
                'codigo_qr'                => Str::uuid(),
                'tax_id'                   => 1,
                'adult_price_total'        => 1 * 25.00, // 25.00
                'child_price_total'        => 2 * 18.00, // 36.00
                'applied_tax'              => 10.00,
                'created_at'               => now(),
                'updated_at'               => now(),
            ],
        ]);
    }
}
