<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Tests\Feature\Support\ApiFixtures;
use Tests\TestCase;

class ProfilesTest extends TestCase
{
    use RefreshDatabase;
    use ApiFixtures;

    public function test_catalog_creator_can_update_and_delete_only_own_records(): void
    {
        foreach (['empresa', 'autonomo'] as $tipo) {
            $creator = $this->makeOrphanUser(['tipo' => $tipo]);
            $other = $this->makeOrphanUser(['tipo' => $tipo]);
            $opposite = $this->makeOrphanUser(['tipo' => $tipo === 'empresa' ? 'autonomo' : 'empresa']);
            $path = $tipo === 'empresa' ? '/api/empresas' : '/api/autonomos';
            $payload = $tipo === 'empresa'
                ? ['nome' => 'Catálogo empresa', 'cnpj' => '11222333000188', 'endereco' => 'Rua A', 'telefone' => '1133334444', 'email' => 'catalogo-empresa@example.test']
                : ['nome' => 'Catálogo autônomo', 'cpf' => '11222333444', 'especialidade' => 'Elétrica', 'telefone' => '11999999999', 'email' => 'catalogo-autonomo@example.test'];

            $this->withHeaders($this->authHeaders($opposite))->postJson($path, $payload)->assertForbidden();
            $created = $this->withHeaders($this->authHeaders($creator))
                ->postJson($path, $payload + ['created_by' => $other->id])
                ->assertCreated()->assertJsonPath('created_by', $creator->id);
            $id = $created->json('id');
            $this->withHeaders($this->authHeaders($other))->putJson($path.'/'.$id, ['nome' => 'Indevido'])->assertForbidden();
            $this->withHeaders($this->authHeaders($other))->deleteJson($path.'/'.$id)->assertForbidden();
            $this->withHeaders($this->authHeaders($creator))->putJson($path.'/'.$id, ['nome' => 'Catálogo atualizado'])->assertOk();
            $this->getJson($path.'/'.$id)->assertOk()->assertJsonPath('nome', 'Catálogo atualizado');
            $this->withHeaders($this->authHeaders($creator))->deleteJson($path.'/'.$id)->assertOk();
            $this->assertDatabaseMissing($tipo === 'empresa' ? 'empresas' : 'autonomos', ['id' => $id]);
            $this->assertDatabaseHas('users', ['id' => $creator->id]);
        }
    }

    public function test_real_account_owner_has_priority_over_catalog_creator(): void
    {
        $creator = $this->makeOrphanUser(['tipo' => 'empresa']);
        $empresa = $this->makeEmpresa(['created_by' => $creator->id]);
        $owner = $this->makeEmpresaUser($empresa);
        $this->withHeaders($this->authHeaders($creator))->putJson('/api/empresas/'.$empresa->id, ['nome' => 'Indevido'])->assertForbidden();
        $this->withHeaders($this->authHeaders($owner))->putJson('/api/empresas/'.$empresa->id, ['nome' => 'Dono real'])->assertOk();
        $this->assertDatabaseHas('users', ['id' => $owner->id, 'name' => 'Dono real']);
    }

    public function test_profile_crud_validates_and_syncs_empresa_name_and_email_to_user(): void
    {
        $creator = $this->makeOrphanUser(['tipo' => 'empresa']);
        $this->withHeaders($this->authHeaders($creator))
            ->postJson('/api/empresas', [])
            ->assertUnprocessable();

        $created = $this->withHeaders($this->authHeaders($creator))
            ->postJson('/api/empresas', [
                'nome' => 'Empresa criada pela API',
                'cnpj' => '12345678000199',
                'endereco' => 'Rua Nova, 20',
                'telefone' => '1133334444',
                'email' => 'empresa-criada@example.test',
            ])
            ->assertCreated();
        $createdId = $created->json('id');
        $this->assertNotNull($createdId);
        $this->getJson('/api/empresas/' . $createdId)->assertOk();

        $empresa = $this->makeEmpresa([
            'nome' => 'Nome antigo da empresa',
            'email' => 'empresa-antiga@example.test',
        ]);
        $owner = $this->makeEmpresaUser($empresa);
        $newName = 'Empresa atualizada';
        $newEmail = 'empresa-atualizada@example.test';

        $this->withHeaders($this->authHeaders($owner))
            ->putJson('/api/empresas/' . $empresa->id, [
                'nome' => $newName,
                'email' => $newEmail,
            ])
            ->assertOk();
        $this->assertDatabaseHas('empresas', [
            'id' => $empresa->id, 'nome' => $newName, 'email' => $newEmail,
        ]);
        $this->assertDatabaseHas('users', [
            'id' => $owner->id, 'name' => $newName, 'email' => $newEmail,
        ]);

        $this->withHeaders($this->authHeaders($owner))
            ->putJson('/api/empresas/' . $empresa->id, ['email' => 'email-invalido'])
            ->assertUnprocessable();
    }

    public function test_profile_crud_validates_and_syncs_autonomo_name_and_email_to_user(): void
    {
        $creator = $this->makeOrphanUser(['tipo' => 'autonomo']);
        $this->withHeaders($this->authHeaders($creator))
            ->postJson('/api/autonomos', [])
            ->assertUnprocessable();

        $created = $this->withHeaders($this->authHeaders($creator))
            ->postJson('/api/autonomos', [
                'nome' => 'Profissional criado pela API',
                'cpf' => '32165498700',
                'telefone' => '11977776666',
                'email' => 'autonomo-criado@example.test',
                'especialidade' => 'Hidráulica',
            ])
            ->assertCreated();
        $createdId = $created->json('id');
        $this->assertNotNull($createdId);
        $this->getJson('/api/autonomos/' . $createdId)->assertOk();

        $autonomo = $this->makeAutonomo([
            'nome' => 'Nome antigo do autônomo',
            'email' => 'autonomo-antigo@example.test',
        ]);
        $owner = $this->makeAutonomoUser($autonomo);
        $newName = 'Autônomo atualizado';
        $newEmail = 'autonomo-atualizado@example.test';

        $this->withHeaders($this->authHeaders($owner))
            ->putJson('/api/autonomos/' . $autonomo->id, [
                'nome' => $newName,
                'email' => $newEmail,
            ])
            ->assertOk();
        $this->assertDatabaseHas('autonomos', [
            'id' => $autonomo->id, 'nome' => $newName, 'email' => $newEmail,
        ]);
        $this->assertDatabaseHas('users', [
            'id' => $owner->id, 'name' => $newName, 'email' => $newEmail,
        ]);

        $this->withHeaders($this->authHeaders($owner))
            ->putJson('/api/autonomos/' . $autonomo->id, ['email' => 'email-invalido'])
            ->assertUnprocessable();
    }

    public function test_only_profile_owner_can_update_or_delete_and_delete_removes_user_and_tokens(): void
    {
        $empresa = $this->makeEmpresa();
        $owner = $this->makeEmpresaUser($empresa);
        $other = $this->makeEmpresaUser($this->makeEmpresa());

        $this->assertForbiddenOrMissing(
            $this->withHeaders($this->authHeaders($other))
                ->putJson('/api/empresas/' . $empresa->id, ['nome' => 'Tentativa indevida'])
        );
        $this->assertForbiddenOrMissing(
            $this->withHeaders($this->authHeaders($other))
                ->deleteJson('/api/empresas/' . $empresa->id)
        );

        $ownerToken = $owner->createToken('token-a-remover');
        Auth::forgetGuards();
        $this->withHeaders([
            'Accept' => 'application/json',
            'Authorization' => 'Bearer ' . $ownerToken->plainTextToken,
        ])->deleteJson('/api/empresas/' . $empresa->id)->assertOk();

        $this->assertDatabaseMissing('empresas', ['id' => $empresa->id]);
        $this->assertDatabaseMissing('users', ['id' => $owner->id]);
        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $ownerToken->accessToken->id]);
    }

    public function test_deleting_autonomo_owner_removes_user_and_tokens(): void
    {
        $autonomo = $this->makeAutonomo();
        $owner = $this->makeAutonomoUser($autonomo);
        $token = $owner->createToken('autonomo-a-remover');

        $this->withHeaders([
            'Accept' => 'application/json',
            'Authorization' => 'Bearer ' . $token->plainTextToken,
        ])->deleteJson('/api/autonomos/' . $autonomo->id)->assertOk();

        $this->assertDatabaseMissing('autonomos', ['id' => $autonomo->id]);
        $this->assertDatabaseMissing('users', ['id' => $owner->id]);
        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $token->accessToken->id]);
    }

    public function test_profile_endpoints_and_photo_require_authentication(): void
    {
        $this->getJson('/api/perfil')->assertUnauthorized();
        $this->putJson('/api/perfil', ['descricao' => 'Sem autenticação'])->assertUnauthorized();
        $this->postJson('/api/perfil/foto', [
            'foto' => $this->fakeImage('sem-auth.png', 'image/png'),
        ])->assertUnauthorized();
    }

    public function test_profile_description_and_photo_work_for_empresa_and_autonomo(): void
    {
        Storage::fake('public');

        $empresa = $this->makeEmpresa();
        $empresaUser = $this->makeEmpresaUser($empresa);
        $autonomo = $this->makeAutonomo();
        $autonomoUser = $this->makeAutonomoUser($autonomo);

        foreach ([[$empresaUser, $empresa, 'empresa'], [$autonomoUser, $autonomo, 'autonomo']] as [$user, $profile, $type]) {
            $this->withHeaders($this->authHeaders($user))
                ->getJson('/api/perfil')
                ->assertOk()
                ->assertJsonPath('tipo', $type)
                ->assertJsonPath('perfil.id', $profile->id);

            $this->withHeaders($this->authHeaders($user))
                ->putJson('/api/perfil', [])
                ->assertUnprocessable();
            $this->withHeaders($this->authHeaders($user))
                ->putJson('/api/perfil', ['descricao' => str_repeat('x', 5001)])
                ->assertUnprocessable();

            $this->withHeaders($this->authHeaders($user))
                ->putJson('/api/perfil', ['descricao' => 'Descrição exclusiva da própria conta'])
                ->assertOk()
                ->assertJsonPath('perfil.descricao', 'Descrição exclusiva da própria conta');
            $this->assertDatabaseHas($profile->getTable(), [
                'id' => $profile->id,
                'descricao' => 'Descrição exclusiva da própria conta',
            ]);
        }

        foreach ([
            [$empresaUser, 'foto-empresa.jpg'],
            [$autonomoUser, 'foto-autonomo.png'],
            [$empresaUser, 'foto-empresa.webp'],
        ] as [$user, $filename]) {
            $mime = match (pathinfo($filename, PATHINFO_EXTENSION)) {
                'jpg', 'jpeg' => 'image/jpeg',
                'webp' => 'image/webp',
                default => 'image/png',
            };
            $response = $this->withHeaders($this->authHeaders($user))
                ->post('/api/perfil/foto', [
                    'foto' => $this->fakeImage($filename, $mime),
                ])
                ->assertOk();
            $response->assertJsonStructure(['mensagem', 'foto_url']);
            $profile = $user->fresh()->tipo === 'empresa' ? $user->fresh()->empresa : $user->fresh()->autonomo;
            $this->assertNotNull($profile->foto_path);
            Storage::disk('public')->assertExists($profile->foto_path);
        }

        $this->withHeaders($this->authHeaders($empresaUser))
            ->post('/api/perfil/foto', [
                'foto' => UploadedFile::fake()->create('grande.jpg', 2049, 'image/jpeg'),
            ])->assertUnprocessable();
        $this->withHeaders($this->authHeaders($autonomoUser))
            ->post('/api/perfil/foto', [
                'foto' => UploadedFile::fake()->create('arquivo.txt', 1, 'text/plain'),
            ])->assertUnprocessable();
    }
}
