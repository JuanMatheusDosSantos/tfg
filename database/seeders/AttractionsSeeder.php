<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class AttractionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table("attractions")->insert([
            [
                "id" => 1,
                "name" => "nombre1",
                "type" => 1,
                "duration" => 5,
                "max_capacity" => 20,
                "park_id" => 1,
            ]
        ]);
    }
}
