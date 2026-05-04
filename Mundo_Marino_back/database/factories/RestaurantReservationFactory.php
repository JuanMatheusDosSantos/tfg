<?php

namespace Database\Factories;

use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class RestaurantReservationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'          => User::factory(),
            'restaurant_id'    => Restaurant::factory(),
            'reservation_date' => fake()->dateTimeBetween('now', '+30 days')->format('Y-m-d'),
            'reservation_hour' => fake()->time('H:i:s'),
            'party_size'       => fake()->numberBetween(1, 10),
            'status'           => 'pending',
        ];
    }
}
