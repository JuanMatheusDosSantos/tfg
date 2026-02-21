<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Restaurant_reservationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table("restaurant_reservations")->insert(
            [
                "id"=>1,
                "user_id" => 1,
                "restaurant_id" => 1,
                "reservation_date" => "2026-02-02",
                "reservation_hour" => "10:00",
                "party_size" => 2,
//            "adults"=>2,
//                "child" => 7
            ]
        );
    }
}
