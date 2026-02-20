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
//        DB::table('users')->insert([
//           "id"=>1,
//           "name"=>"admin",
//            "email" => "prueba@gmail.com",
//            "password" => bcrypt("12345678"),
//            "role"=>"admin",
//            "created_at"=>now(),
//            "updated_at"=>now()
//        ]);
        User::factory()->create([
            "name"=>"admin",
            "email"=>"admin@gmail.com",
            "password"=>bcrypt("12345678"),
            "role"=>"admin",
            "phone"=>123456789
        ]);
        User::factory()->count(10)->create();
    }
}
