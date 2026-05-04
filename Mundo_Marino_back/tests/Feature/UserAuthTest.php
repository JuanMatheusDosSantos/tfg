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
            'birthdate' => '2000-02-04',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'juan@gmail.com']);
    }
    #[Test]
    public function usuario_puede_editar_su_perfil()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')
            ->putJson('/api/update/profile', [
                'name'  => 'Nombre Actualizado',
                'phone' => '612345678',
            ]);

        $response->assertOk(); // 200
        $this->assertDatabaseHas('users', [
            'id'   => $user->id,
            'name' => 'Nombre Actualizado',
        ]);
    }

    #[Test]
    public function usuario_puede_loguearse()
    {
        $user = User::factory()->create(['password' => bcrypt('12345678')]);

        $response = $this->postJson('/api/login', [
            'email'    => $user->email,
            'password' => '12345678',
        ]);

        $response->assertOk(); // 200
        $response->assertJsonStructure([
            'access_token',
            'token_type',
            'expires_in',
        ]);
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
