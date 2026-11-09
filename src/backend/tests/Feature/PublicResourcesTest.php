<?php

namespace Tests\Feature;

use App\Models\ServicoAutonomo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Support\ApiFixtures;
use Tests\TestCase;

class PublicResourcesTest extends TestCase
{
    use RefreshDatabase;
    use ApiFixtures;

    public function test_reads_of_servicos_empresas_autonomos_and_pivot_are_public(): void
    {
        $servico = $this->makeServico();
        $empresa = $this->makeEmpresa();
        $autonomo = $this->makeAutonomo();
        $this->makePivot($servico, $autonomo);

        $this->getJson('/api/servicos')->assertOk();
        $this->getJson('/api/servicos/' . $servico->id)->assertOk();
        $this->getJson('/api/empresas')->assertOk();
        $this->getJson('/api/empresas/' . $empresa->id)->assertOk();
        $this->getJson('/api/autonomos')->assertOk();
        $this->getJson('/api/autonomos/' . $autonomo->id)->assertOk();
        $this->getJson('/api/servicos-autonomos')->assertOk();
        $this->getJson('/api/servicos-autonomos/' . $servico->id . '/' . $autonomo->id)->assertOk();
    }

    public function test_every_mutation_of_public_resources_requires_sanctum(): void
    {
        $servico = $this->makeServico();
        $empresa = $this->makeEmpresa();
        $autonomo = $this->makeAutonomo();

        $this->postJson('/api/servicos', [
            'nome' => 'Novo serviço', 'categoria' => 'Pintura',
        ])->assertUnauthorized();
        $this->putJson('/api/servicos/' . $servico->id, ['nome' => 'Alterado'])->assertUnauthorized();
        $this->deleteJson('/api/servicos/' . $servico->id)->assertUnauthorized();

        $this->postJson('/api/empresas', [
            'nome' => 'Empresa nova', 'cnpj' => '12345678000199', 'endereco' => 'Rua A',
            'telefone' => '1133334444', 'email' => 'nova@example.test',
        ])->assertUnauthorized();
        $this->putJson('/api/empresas/' . $empresa->id, ['nome' => 'Alterada'])->assertUnauthorized();
        $this->deleteJson('/api/empresas/' . $empresa->id)->assertUnauthorized();

        $this->postJson('/api/autonomos', [
            'nome' => 'Profissional novo', 'cpf' => '12345678901', 'telefone' => '11999999999',
            'email' => 'novo@example.test', 'especialidade' => 'Pintura',
        ])->assertUnauthorized();
        $this->putJson('/api/autonomos/' . $autonomo->id, ['nome' => 'Alterado'])->assertUnauthorized();
        $this->deleteJson('/api/autonomos/' . $autonomo->id)->assertUnauthorized();

        $this->postJson('/api/servicos-autonomos', [
            'id_servico' => $servico->id, 'id_autonomo' => $autonomo->id,
        ])->assertUnauthorized();
        $this->putJson('/api/servicos-autonomos/' . $servico->id . '/' . $autonomo->id, [
            'status' => 'inativo',
        ])->assertUnauthorized();
        $this->deleteJson('/api/servicos-autonomos/' . $servico->id . '/' . $autonomo->id)->assertUnauthorized();
    }

    public function test_servico_has_validated_authenticated_crud(): void
    {
        $user = $this->makeOrphanUser();
        $this->withHeaders($this->authHeaders($user))
            ->postJson('/api/servicos', [])
            ->assertUnprocessable();

        $created = $this->withHeaders($this->authHeaders($user))
            ->postJson('/api/servicos', [
                'nome' => 'Instalação elétrica',
                'descricao' => 'Serviço residencial',
                'categoria' => 'Elétrica',
                'preco' => 199.90,
                'ativo' => true,
            ])
            ->assertCreated()
            ->assertJsonPath('servico.nome', 'Instalação elétrica');

        $id = $created->json('servico.id');
        $this->getJson('/api/servicos/' . $id)->assertOk();
        $this->withHeaders($this->authHeaders($user))
            ->putJson('/api/servicos/' . $id, ['nome' => 'Instalação atualizada', 'preco' => -1])
            ->assertUnprocessable();
        $this->withHeaders($this->authHeaders($user))
            ->putJson('/api/servicos/' . $id, ['nome' => 'Instalação atualizada'])
            ->assertOk();
        $this->assertDatabaseHas('servicos', ['id' => $id, 'nome' => 'Instalação atualizada']);
        $this->withHeaders($this->authHeaders($user))->deleteJson('/api/servicos/' . $id)->assertOk();
        $this->assertDatabaseMissing('servicos', ['id' => $id]);
    }

    public function test_pivot_validates_foreign_keys_rejects_duplicates_and_allows_noop_update(): void
    {
        $user = $this->makeOrphanUser();
        $servico = $this->makeServico();
        $autonomo = $this->makeAutonomo();

        $this->withHeaders($this->authHeaders($user))
            ->postJson('/api/servicos-autonomos', [
                'id_servico' => 999999, 'id_autonomo' => $autonomo->id,
            ])->assertUnprocessable();
        $this->withHeaders($this->authHeaders($user))
            ->postJson('/api/servicos-autonomos', [
                'id_servico' => $servico->id, 'id_autonomo' => 999999,
            ])->assertUnprocessable();

        $this->withHeaders($this->authHeaders($user))
            ->postJson('/api/servicos-autonomos', [
                'id_servico' => $servico->id,
                'id_autonomo' => $autonomo->id,
                'status' => 'ativo',
                'nivel_experiencia' => 'avançado',
            ])->assertCreated();

        $this->withHeaders($this->authHeaders($user))
            ->postJson('/api/servicos-autonomos', [
                'id_servico' => $servico->id, 'id_autonomo' => $autonomo->id,
            ])->assertStatus(409);

        $this->withHeaders($this->authHeaders($user))
            ->putJson('/api/servicos-autonomos/' . $servico->id . '/' . $autonomo->id, [
                'id_servico' => $servico->id,
                'id_autonomo' => $autonomo->id,
                'status' => 'ativo',
            ])->assertOk();
        $this->assertDatabaseHas('servicos_autonomo', [
            'id_servico' => $servico->id,
            'id_autonomo' => $autonomo->id,
            'status' => 'ativo',
        ]);

        $this->withHeaders($this->authHeaders($user))
            ->putJson('/api/servicos-autonomos/' . $servico->id . '/' . $autonomo->id, [
                'status' => 'inativo',
                'nivel_experiencia' => 'especialista',
            ])->assertOk()->assertJsonPath('status', 'inativo');
        $this->assertDatabaseHas('servicos_autonomo', [
            'id_servico' => $servico->id,
            'id_autonomo' => $autonomo->id,
            'status' => 'inativo',
            'nivel_experiencia' => 'especialista',
        ]);

        $this->withHeaders($this->authHeaders($user))
            ->deleteJson('/api/servicos-autonomos/' . $servico->id . '/' . $autonomo->id)
            ->assertOk();
        $this->assertDatabaseMissing('servicos_autonomo', [
            'id_servico' => $servico->id, 'id_autonomo' => $autonomo->id,
        ]);
    }

    public function test_deleting_a_public_resource_cascades_its_pivot_relations(): void
    {
        $user = $this->makeOrphanUser();
        $servico = $this->makeServico();
        $autonomo = $this->makeAutonomo();
        $this->makePivot($servico, $autonomo);

        $this->withHeaders($this->authHeaders($user))
            ->deleteJson('/api/servicos/' . $servico->id)
            ->assertOk();

        $this->assertDatabaseMissing('servicos_autonomo', [
            'id_servico' => $servico->id,
            'id_autonomo' => $autonomo->id,
        ]);
    }
}
