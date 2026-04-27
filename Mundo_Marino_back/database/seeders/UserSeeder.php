<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            "name"=>"admin",
            "email"=>"daw04.2025.jesuitas@gmail.com",
            "password"=>bcrypt("12345678"),
            "role"=>"admin",
            "phone"=>123456789
        ]);
        User::factory()->create([
            "name" => "park",
            "email" => "park@yahoo.com",
            "password" => bcrypt("12345678"),
            "role" => "park",
            "park_id"=>1,
            "phone" => 987654321
        ]);

        User::factory()->create([
            "name" => "restaurant",
            "email" => "restaurant@gmail.com",
            "password" => bcrypt("12345678"),
            "role" => "restaurant",
            "park_id"=>1,
            "phone" => 555666777
        ]);
        User::factory()->create([
            "name"=>"Joana",
            "email"=>"daw06.2025@gmail.com",
            "password"=>bcrypt("12345678"),
            "role"=>"admin",
            "phone"=>123456789
        ]);
        User::factory()->count(10)->create();
    }
}
