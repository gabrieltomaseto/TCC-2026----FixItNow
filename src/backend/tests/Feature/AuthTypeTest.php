<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\Feature\Support\ApiFixtures;
use Tests\TestCase;

class AuthTypeTest extends TestCase
{
    use RefreshDatabase;
    use ApiFixtures;

    public function test_login_without_tipo_preserves_the_legacy_flow_and_emits_a_sanctum_token(): void
    {
        $empresa = $this->makeEmpresa();
        $user = $this->makeEmpresaUser($empresa, [
            'password' => Hash::make('senha-segura'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'senha-segura',
        ])->assertOk()
            ->assertJsonPath('tipo', 'empresa')
            ->assertJsonStructure(['token']);

        $this->assertNotEmpty($response->json('token'));
        $this->assertDatabaseCount('personal_access_tokens', 1);
    }

    public function test_optional_tipo_must_match_before_token_generation(): void
    {
        $empresa = $this->makeEmpresa();
        $user = $this->makeEmpresaUser($empresa, [
            'password' => Hash::make('senha-segura'),
        ]);

        $this->assertStatusIn($this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'senha-segura',
            'tipo' => 'autonomo',
        ]), [401, 403, 409, 422]);
        $this->assertDatabaseCount('personal_access_tokens', 0);

        $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'senha-segura',
            'tipo' => 'perfil-inexistente',
        ])->assertUnprocessable();
        $this->assertDatabaseCount('personal_access_tokens', 0);

        $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'senha-segura',
            'tipo' => 'empresa',
        ])->assertOk()->assertJsonStructure(['token']);
        $this->assertDatabaseCount('personal_access_tokens', 1);
    }
}
