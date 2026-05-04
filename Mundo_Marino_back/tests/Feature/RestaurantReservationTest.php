<?php

namespace Tests\Feature;

use App\Models\Restaurant;
use App\Models\Restaurant_reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class RestaurantReservationTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Restaurant $restaurant;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\ParksSeeder::class);
        $this->seed(\Database\Seeders\RestaurantSeeder::class);
        $this->seed(\Database\Seeders\UserSeeder::class);
        $this->user       = User::first();
        $this->restaurant = Restaurant::first();
    }

    private function crearReserva(array $extra = []): Restaurant_reservation
    {
        return Restaurant_reservation::create(array_merge([
            'user_id'          => $this->user->id,
            'restaurant_id'    => $this->restaurant->id,
            'reservation_date' => '2026-06-15',
            'reservation_hour' => '14:00',
            'party_size'       => 4,
            'status'           => 'pending',
        ], $extra));
    }

    #[Test]
    public function puede_listar_sus_reservas_de_restaurante()
    {
        $this->crearReserva();

        $response = $this->actingAs($this->user, 'api')
            ->getJson('/api/restaurant_user_reservations');

        $response->assertOk();
    }

    #[Test]
    public function puede_ver_una_reserva_de_restaurante()
    {
        $reservation = $this->crearReserva();

        $this->actingAs($this->user, 'api')
            ->getJson("/api/restaurant_reservation/{$reservation->id}")
            ->assertOk()
            ->assertJsonFragment(['id' => $reservation->id]);
    }

    #[Test]
    public function puede_crear_una_reserva_de_restaurante()
    {
        $response = $this->actingAs($this->user, 'api')
            ->postJson('/api/restaurant_reservation', [
                'user_id'          => $this->user->id,  // ← añadir
                'restaurant_id'    => $this->restaurant->id,
                'reservation_date' => '2026-07-15',
                'reservation_hour' => '14:00',
                'party_size'       => 4,
            ]);
        $response->assertStatus(200);

        $this->assertDatabaseHas('restaurant_reservations', [
            'user_id'       => $this->user->id,
            'restaurant_id' => $this->restaurant->id,
            'party_size'    => 4,
        ]);
    }

    #[Test]
    public function puede_editar_una_reserva_de_restaurante()
    {
        $reservation = $this->crearReserva();

        $response = $this->actingAs($this->user, 'api')
            ->putJson("/api/restaurant_reservation/{$reservation->id}", [
                'user_id'          => $this->user->id,        // ← añadir
                'restaurant_id'    => $this->restaurant->id,  // ← añadir
                'reservation_date' => '2026-06-15',           // ← añadir
                'reservation_hour' => '14:00',             // ← añadir
                'party_size'       => 6,
                'status'           => 'pending',              // ← añadir
            ]);
        $response->assertOk();

        $this->assertDatabaseHas('restaurant_reservations', [
            'id'         => $reservation->id,
            'party_size' => 6,
        ]);
    }

    #[Test]
    public function puede_eliminar_una_reserva_de_restaurante()
    {
        $reservation = $this->crearReserva(['reservation_date' => '2026-06-20', 'reservation_hour' => '15:00:00']);

        $this->actingAs($this->user, 'api')
            ->deleteJson("/api/restaurant_reservation/{$reservation->id}")
            ->assertOk();

        $this->assertDatabaseMissing('restaurant_reservations', [
            'id' => $reservation->id,
        ]);
    }

    #[Test]
    public function no_autenticado_no_puede_acceder_a_reservas()
    {
        $this->getJson('/api/restaurant_reservations')
            ->assertUnauthorized();
    }
}
