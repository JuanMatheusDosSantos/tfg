<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ParkReservationPricesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('park_reservation_prices')->insert([
            // Parque 1 - Entrada General
            [
                'park_id'                    => 1,
                'park_reservation_type_id'   => 1,
                'price'                      => 15.0000, // adulto
                'created_at'                 => now(),
                'updated_at'                 => now(),
            ],
            // Parque 1 - Pase VIP
            [
                'park_id'                    => 1,
                'park_reservation_type_id'   => 2,
                'price'                      => 25.0000, // adulto
                'created_at'                 => now(),
                'updated_at'                 => now(),
            ],
        ]);
    }
}
