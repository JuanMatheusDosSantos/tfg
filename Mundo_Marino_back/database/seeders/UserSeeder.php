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
            "phone"=>123456789,
            "birthdate"=>"1990-05-15"
        ]);
        User::factory()->create([
            "name" => "park",
            "email" => "park@yahoo.com",
            "password" => bcrypt("12345678"),
            "role" => "park",
            "park_id"=>1,
            "phone" => 987654321,
            "birthdate"=>"1985-03-22"
        ]);

        User::factory()->create([
            "name" => "restaurant",
            "email" => "restaurant@gmail.com",
            "password" => bcrypt("12345678"),
            "role" => "restaurant",
            "park_id"=>1,
            "restaurant_id"=>1,
            "phone" => 555666777,
            "birthdate"=>"1992-11-08"
        ]);
        User::factory()->create([
            "name" => "user",
            "email" => "user@gmail.com",
            "password" => bcrypt("12345678"),
            "role" => "user",
            "park_id"=>1,
            "phone" => 555666777,
            "birthdate"=>"1992-11-08"
        ]);
        User::factory()->create([
            "name"=>"Joana",
            "email"=>"daw06.2025@gmail.com",
            "password"=>bcrypt("12345678"),
            "role"=>"admin",
            "phone"=>123456789,
            "birthdate"=>"1988-07-30"
        ]);
        User::factory()->count(10)->create();
    }
}
