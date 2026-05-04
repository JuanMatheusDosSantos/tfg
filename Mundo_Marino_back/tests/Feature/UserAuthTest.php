<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;


class UserAuthTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function usuario_puede_registrarse()
    {
        $response = $this->postJson('/api/register', [
            'name'      => 'Juan García',
            'email'     => 'juan@gmail.com',
            'password'  => '12345678',
            'phone'     => '123456789',
            'birthdate' => '04/02/2000',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', ['email' => 'juan@gmail.com']);
    }
    /** @test */
    public function usuario_puede_cerrar_sesion()
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/logout')
            ->assertRedirect('/');

        $this->assertGuest();
    }
    /** @test */
    public function login_falla_con_credenciales_incorrectas()
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email'    => $user->email,
            'password' => 'contraseña_incorrecta',
        ])->assertSessionHasErrors('email');

        $this->assertGuest();
    }
    /** @test */
    public function usuario_no_autenticado_es_redirigido()
    {
        $this->get('/booking')->assertRedirect('/login');
    }
}
