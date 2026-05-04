<?php

namespace Tests\Feature;

use App\Models\Park;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AdminParkTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\ParksSeeder::class);
        $this->seed(\Database\Seeders\UserSeeder::class);

        $this->admin = User::where('role', 'admin')->first();
        $this->user  = User::where('role', 'user')->first();
    }

    #[Test]
    public function admin_puede_crear_un_parque()
    {
        $response = $this->actingAs($this->admin, 'api')
            ->postJson('/api/admin/park', [
                'name'         => 'Parque Test',
                'location'     => 'Madrid',
                'opening_time' => '09:00',
                'closing_time' => '20:00',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('parks', ['name' => 'Parque Test']);
    }

    #[Test]
    public function usuario_normal_no_puede_crear_un_parque()
    {
        $this->actingAs($this->user, 'api')
            ->postJson('/api/admin/park', [
                'name'         => 'Parque No Autorizado',
                'location'     => 'Barcelona',
                'opening_time' => '09:00',
                'closing_time' => '20:00',
            ])
            ->assertForbidden(); // 403
    }

    #[Test]
    public function no_autenticado_no_puede_crear_un_parque()
    {
        $this->postJson('/api/admin/park', [
            'name'         => 'Parque Sin Token',
            'location'     => 'Valencia',
            'opening_time' => '09:00',
            'closing_time' => '20:00',
        ])->assertUnauthorized(); // 401
    }

    #[Test]
    public function crear_parque_falla_sin_campos_requeridos()
    {
        $this->actingAs($this->admin, 'api')
            ->postJson('/api/admin/park', [])
            ->assertStatus(400);
    }

    #[Test]
    public function admin_puede_listar_parques()
    {
        $this->actingAs($this->admin, 'api')
            ->getJson('/api/admin/parks')
            ->assertOk();
    }

    #[Test]
    public function admin_puede_ver_un_parque()
    {
        $park = Park::first();

        $this->actingAs($this->admin, 'api')
            ->getJson("/api/admin/park/{$park->id}")
            ->assertOk()
            ->assertJsonFragment(['id' => $park->id]);
    }
}
