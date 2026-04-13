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
                [
                    'id'              => 1,
                    'user_id'         => 1,
                    'restaurant_id'   => 1,
                    'reservation_date' => '2026-02-02',
                    'reservation_hour' => '10:00',
                    'party_size'      => 2,
                    'status'          => 'pending',
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ],// Fechas recientes con status accepted/completed
                [
                    'id' => 2,
                    'user_id' => 1,
                    'restaurant_id' => 1,
                    'reservation_date' => now()->subDays(1)->toDateString(),
                    'reservation_hour' => '13:00',
                    'party_size' => 3,
                    'status' => 'accepted',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => 3,
                    'user_id' => 2,
                    'restaurant_id' => 1,
                    'reservation_date' => now()->subDays(2)->toDateString(),
                    'reservation_hour' => '14:30',
                    'party_size' => 2,
                    'status' => 'completed',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => 4,
                    'user_id' => 1,
                    'restaurant_id' => 1,
                    'reservation_date' => now()->subDays(3)->toDateString(),
                    'reservation_hour' => '20:00',
                    'party_size' => 4,
                    'status' => 'accepted',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => 5,
                    'user_id' => 2,
                    'restaurant_id' => 1,
                    'reservation_date' => now()->subDays(5)->toDateString(),
                    'reservation_hour' => '21:00',
                    'party_size' => 6,
                    'status' => 'completed',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => 6,
                    'user_id' => 1,
                    'restaurant_id' => 1,
                    'reservation_date' => now()->subDays(7)->toDateString(),
                    'reservation_hour' => '19:30',
                    'party_size' => 2,
                    'status' => 'accepted',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => 7,
                    'user_id' => 2,
                    'restaurant_id' => 1,
                    'reservation_date' => now()->subDays(10)->toDateString(),
                    'reservation_hour' => '13:30',
                    'party_size' => 5,
                    'status' => 'completed',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
// Status distintos
                [
                    'id' => 8,
                    'user_id' => 1,
                    'restaurant_id' => 1,
                    'reservation_date' => now()->subDays(4)->toDateString(),
                    'reservation_hour' => '15:00',
                    'party_size' => 3,
                    'status' => 'cancelled',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => 9,
                    'user_id' => 2,
                    'restaurant_id' => 1,
                    'reservation_date' => now()->subDays(6)->toDateString(),
                    'reservation_hour' => '20:30',
                    'party_size' => 2,
                    'status' => 'no_show',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => 10,
                    'user_id' => 1,
                    'restaurant_id' => 1,
                    'reservation_date' => now()->subDays(8)->toDateString(),
                    'reservation_hour' => '14:00',
                    'party_size' => 4,
                    'status' => 'late',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => 11,
                    'user_id' => 2,
                    'restaurant_id' => 1,
                    'reservation_date' => now()->subDays(9)->toDateString(),
                    'reservation_hour' => '21:30',
                    'party_size' => 1,
                    'status' => 'checked_in',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => 12,
                    'user_id' => 1,
                    'restaurant_id' => 1,
                    'reservation_date' => now()->addDays(2)->toDateString(),
                    'reservation_hour' => '13:00',
                    'party_size' => 2,
                    'status' => 'pending',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]
        );
    }
}
