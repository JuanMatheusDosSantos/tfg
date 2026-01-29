<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RestaurantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('restaurants')->insert([
            "id" => 1,
            "name"=>"prueba",
            "max_capacity" => 20,
            "park_id"=>1
        ]);
    }
}
