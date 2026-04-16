<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ParkReservationPricesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('park_reservation_prices')->insert([
            [
                'park_id'                  => 1,
                'park_reservation_type_id' => 1,
                'adult_price'              => 15.00,
                'child_price'              => 10.00,
                'created_at'               => now(),
                'updated_at'               => now(),
            ],
            [
                'park_id'                  => 1,
                'park_reservation_type_id' => 2,
                'adult_price'              => 25.00,
                'child_price'              => 17.00,
                'created_at'               => now(),
                'updated_at'               => now(),
            ],
        ]);
    }
}
