<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaxesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('taxes')->insert([
            [
                'id'         => 1,
                'name'       => 'IVA',
                'percentage' => 10.00,
                'active'     => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
