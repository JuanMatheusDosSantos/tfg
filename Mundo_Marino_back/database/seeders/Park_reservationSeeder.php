<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Park_reservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table("park_reservations")->insert(
            [
                "id" => 1,
                "user_id" => 1,
                "park_id" => 1,
                "reservation_date" => "2026-02-02",
                "adults" => 2,
                "child" => 7,
                'codigo_qr'  => \Str::uuid()
            ]
        );
    }
}
