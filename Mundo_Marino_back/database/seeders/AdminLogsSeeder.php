<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminLogsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('admin_logs')->insert([
            // Admin (user_id 1)
            [
                'action'         => 'insert',
                'affected_table' => 'parks',
                'old_value'      => '',
                'new_value'      => 'name: Mundo Marino, location: Navarra',
                'user_id'        => 1,
                'created_at'     => now()->subDays(10),
                'updated_at'     => now()->subDays(10),
            ],
            [
                'action'         => 'update',
                'affected_table' => 'park_reservation_prices',
                'old_value'      => 'price: 20.00',
                'new_value'      => 'price: 25.00',
                'user_id'        => 1,
                'created_at'     => now()->subDays(8),
                'updated_at'     => now()->subDays(8),
            ],
            [
                'action'         => 'delete',
                'affected_table' => 'attractions',
                'old_value'      => 'name: Tobogán Viejo, status: closed',
                'new_value'      => '',
                'user_id'        => 1,
                'created_at'     => now()->subDays(6),
                'updated_at'     => now()->subDays(6),
            ],

            // Park (user_id 2)
            [
                'action'         => 'insert',
                'affected_table' => 'attractions',
                'old_value'      => '',
                'new_value'      => 'name: El Remolino, type: intenso',
                'user_id'        => 2,
                'created_at'     => now()->subDays(9),
                'updated_at'     => now()->subDays(9),
            ],
            [
                'action'         => 'update',
                'affected_table' => 'attractions',
                'old_value'      => 'status: maintenance',
                'new_value'      => 'status: operational',
                'user_id'        => 2,
                'created_at'     => now()->subDays(5),
                'updated_at'     => now()->subDays(5),
            ],
            [
                'action'         => 'delete',
                'affected_table' => 'park_reservations',
                'old_value'      => 'id: 3, status: cancelled',
                'new_value'      => '',
                'user_id'        => 2,
                'created_at'     => now()->subDays(3),
                'updated_at'     => now()->subDays(3),
            ],

            // Restaurant (user_id 3)
            [
                'action'         => 'insert',
                'affected_table' => 'restaurant_reservations',
                'old_value'      => '',
                'new_value'      => 'party_size: 4, date: 2026-04-10',
                'user_id'        => 3,
                'created_at'     => now()->subDays(7),
                'updated_at'     => now()->subDays(7),
            ],
            [
                'action'         => 'update',
                'affected_table' => 'restaurant_reservations',
                'old_value'      => 'status: pending',
                'new_value'      => 'status: accepted',
                'user_id'        => 3,
                'created_at'     => now()->subDays(4),
                'updated_at'     => now()->subDays(4),
            ],
            [
                'action'         => 'delete',
                'affected_table' => 'restaurant_reservations',
                'old_value'      => 'id: 8, status: cancelled',
                'new_value'      => '',
                'user_id'        => 3,
                'created_at'     => now()->subDays(2),
                'updated_at'     => now()->subDays(2),
            ],
        ]);
    }
}
