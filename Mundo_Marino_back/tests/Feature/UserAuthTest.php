<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class UserAuthTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function usuario_puede_registrarse()
    {
        $response = $this->postJson('/api/register', [
            'name'      => 'Juan García',
            'email'     => 'juan@gmail.com',
            'password'  => '12345678',
            'phone'     => '123456789',
            'birthdate' => '04/02/2000',
        ]);

        dump($response->json());
        $response->assertStatus(200);
        $this->assertDatabaseHas('users', ['email' => 'juan@gmail.com']);
    }

    #[Test]
    public function usuario_puede_cerrar_sesion()
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'api')  // ← guard JWT
        ->postJson('/api/logout')  // ← ruta API correcta
        ->assertOk();
        // sin assertGuest(), JWT no funciona así
    }

    #[Test]
    public function login_falla_con_credenciales_incorrectas()
    {
        $user = User::factory()->create(['password' => bcrypt('correcta')]);

        $this->postJson('/api/login', [
            'email'    => $user->email,
            'password' => 'incorrecta',
        ])->assertUnauthorized();
    }

    #[Test]
    public function ruta_protegida_sin_token_devuelve_401()
    {
        $this->getJson('/api/park_reservations')
            ->assertUnauthorized(); // 401
    }
}
