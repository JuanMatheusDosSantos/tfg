<?php

namespace Tests\Feature;

use App\Models\Restaurant;
use App\Models\Restaurant_reservation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;
use App\Models\User;

class RestaurantReservationTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function puede_listar_sus_reservas_de_restaurante()
    {
        Restaurant_reservation::factory()->count(3)->create([
            'user_id' => $this->user->id,
        ]);

        $this->actingAs($this->user, 'api')
            ->getJson('/api/restaurant_user_reservations')
            ->assertOk()
            ->assertJsonCount(3);
    }

    #[Test]
    public function puede_ver_una_reserva_de_restaurante()
    {
        $reservation = Restaurant_reservation::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $this->actingAs($this->user, 'api')
            ->getJson("/api/restaurant_reservation/{$reservation->id}")
            ->assertOk()
            ->assertJsonFragment(['id' => $reservation->id]);
    }

    #[Test]
    public function puede_crear_una_reserva_de_restaurante()
    {
        $restaurant = Restaurant::factory()->create();

        $this->actingAs($this->user, 'api')
            ->postJson('/api/restaurant_reservation', [
                'restaurant_id'    => $restaurant->id,
                'reservation_date' => '2026-06-15',
                'reservation_hour' => '14:00:00',
                'party_size'       => 4,
            ])
            ->assertStatus(201); // ajusta si devuelve 200

        $this->assertDatabaseHas('restaurant_reservations', [
            'user_id'       => $this->user->id,
            'restaurant_id' => $restaurant->id,
            'party_size'    => 4,
        ]);
    }

    #[Test]
    public function puede_editar_una_reserva_de_restaurante()
    {
        $reservation = Restaurant_reservation::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $this->actingAs($this->user, 'api')
            ->putJson("/api/restaurant_reservation/{$reservation->id}", [
                'party_size' => 6,
            ])
            ->assertOk();

        $this->assertDatabaseHas('restaurant_reservations', [
            'id'         => $reservation->id,
            'party_size' => 6,
        ]);
    }

    #[Test]
    public function puede_eliminar_una_reserva_de_restaurante()
    {
        $reservation = Restaurant_reservation::factory()->create([
            'user_id' => $this->user->id,
        ]);

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
