<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;

class ParksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table("parks")->insert([
            [
                "id"=>1,
                "name"=>"Mundo Marino y El Arrecife",
                "location"=>"Valencia",
                "opening_time"=>"8:00",
                "closing_time"=>"21:00"
            ]
        ]);
    }
}
