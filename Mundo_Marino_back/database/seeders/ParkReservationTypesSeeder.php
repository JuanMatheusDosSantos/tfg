<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ParkReservationTypesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('park_reservation_types')->insert([
            [
                'id'          => 1,
                'name'        => 'Entrada General',
                'description' => 'Acceso estándar al parque para todas las atracciones',
                'min_age'     => null,
                'max_age'     => null,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'id'          => 2,
                'name'        => 'Pase VIP',
                'description' => 'Acceso prioritario a todas las atracciones con beneficios exclusivos',
                'min_age'     => null,
                'max_age'     => null,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);
    }
}
