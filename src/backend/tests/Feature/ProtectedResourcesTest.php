<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Support\ApiFixtures;
use Tests\TestCase;

class ProtectedResourcesTest extends TestCase
{
    use RefreshDatabase;
    use ApiFixtures;

    public function test_solicitacoes_avaliacoes_e_pagamentos_require_sanctum_for_every_operation(): void
    {
        $paths = [
            ['getJson', '/api/solicitacoes'],
            ['getJson', '/api/solicitacoes/1'],
            ['postJson', '/api/solicitacoes'],
            ['putJson', '/api/solicitacoes/1'],
            ['deleteJson', '/api/solicitacoes/1'],
            ['getJson', '/api/avaliacoes'],
            ['getJson', '/api/avaliacoes/1'],
            ['postJson', '/api/avaliacoes'],
            ['putJson', '/api/avaliacoes/1'],
            ['deleteJson', '/api/avaliacoes/1'],
            ['getJson', '/api/pagamentos'],
            ['getJson', '/api/pagamentos/1'],
            ['postJson', '/api/pagamentos'],
            ['putJson', '/api/pagamentos/1'],
            ['deleteJson', '/api/pagamentos/1'],
        ];

        foreach ($paths as [$method, $path]) {
            $this->{$method}($path, [])->assertUnauthorized();
        }
    }

    public function test_empresa_can_create_scoped_request_with_nullable_profissional_and_all_new_fields(): void
    {
        $empresa = $this->makeEmpresa();
        $owner = $this->makeEmpresaUser($empresa);
        $otherEmpresa = $this->makeEmpresa();
        $autonomo = $this->makeAutonomo(['especialidade' => 'Manutenção']);
        $servico = $this->makeServico();
        $payload = [
            'id_servico' => $servico->id,
            'id_autonomo' => null,
            'id_empresa' => $otherEmpresa->id,
            'descricao_problema' => 'A tomada da cozinha parou de funcionar.',
            'data_solicitacao' => '2026-10-20',
            'nome_contato' => 'Maria Cliente',
            'empresa_contato' => 'Cliente Ltda.',
            'local_atendimento' => 'Rua A, 100',
            'telefone_contato' => '11999998888',
            'tipo_servico' => 'Elétrica residencial',
            'prioridade' => 'alta',
            'preco_estimado' => 340.75,
        ];

        $response = $this->withHeaders($this->authHeaders($owner))
            ->postJson('/api/solicitacoes', $payload)
            ->assertCreated();
        $id = $response->json('id');

        $this->assertDatabaseHas('solicitacoes', [
            'id' => $id,
            'id_empresa' => $empresa->id,
            'id_servico' => $servico->id,
            'id_autonomo' => null,
            'descricao_problema' => $payload['descricao_problema'],
            'nome_contato' => $payload['nome_contato'],
            'empresa_contato' => $payload['empresa_contato'],
            'local_atendimento' => $payload['local_atendimento'],
            'telefone_contato' => $payload['telefone_contato'],
            'tipo_servico' => $payload['tipo_servico'],
            'prioridade' => $payload['prioridade'],
            'preco_estimado' => '340.75',
        ]);

        $autonomoPayload = array_merge($payload, [
            'id_autonomo' => $autonomo->id,
            'descricao_problema' => 'Chamado atribuído a um profissional.',
        ]);
        $assigned = $this->withHeaders($this->authHeaders($owner))
            ->postJson('/api/solicitacoes', $autonomoPayload)
            ->assertCreated();
        $this->assertDatabaseHas('solicitacoes', [
            'id' => $assigned->json('id'),
            'id_autonomo' => $autonomo->id,
            'id_empresa' => $empresa->id,
        ]);
    }

    public function test_solicitacao_is_sent_only_to_autonomos_with_matching_specialty(): void
    {
        $empresa = $this->makeEmpresa();
        $owner = $this->makeEmpresaUser($empresa);
        $servico = $this->makeServico(['nome' => 'Elétrica', 'categoria' => 'Elétrica']);
        $correto = $this->makeAutonomo(['especialidade' => 'Elétrica']);
        $incorreto = $this->makeAutonomo(['especialidade' => 'Hidráulica']);
        $this->makePivot($servico, $incorreto);

        $response = $this->withHeaders($this->authHeaders($owner))
            ->postJson('/api/solicitacoes', [
                'id_servico' => $servico->id,
                'descricao_problema' => 'Reparo no quadro elétrico.',
            ])
            ->assertCreated();

        $this->assertSame(1, $response->json('quantidade_destinatarios'));
        $this->assertSame([$correto->id], array_column($response->json('destinatarios'), 'id'));
        $this->assertDatabaseHas('solicitacoes', ['id_autonomo' => $correto->id, 'id_servico' => $servico->id]);
        $this->assertDatabaseMissing('solicitacoes', ['id_autonomo' => $incorreto->id, 'id_servico' => $servico->id]);
    }

    public function test_solicitacao_store_rejects_non_empresa_missing_description_and_invalid_ids(): void
    {
        $autonomo = $this->makeAutonomo();
        $autonomoUser = $this->makeAutonomoUser($autonomo);
        $servico = $this->makeServico();
        $empresa = $this->makeEmpresa();
        $empresaUser = $this->makeEmpresaUser($empresa);
        $valid = [
            'id_servico' => $servico->id,
            'id_autonomo' => $autonomo->id,
            'descricao_problema' => 'Descrição válida',
        ];

        $this->assertForbiddenOrMissing(
            $this->withHeaders($this->authHeaders($autonomoUser))
                ->postJson('/api/solicitacoes', $valid)
        );
        $this->withHeaders($this->authHeaders($empresaUser))
            ->postJson('/api/solicitacoes', ['id_servico' => $servico->id, 'id_autonomo' => null])
            ->assertUnprocessable();
        $this->withHeaders($this->authHeaders($empresaUser))
            ->postJson('/api/solicitacoes', array_merge($valid, ['id_servico' => 999999]))
            ->assertUnprocessable();
        $this->withHeaders($this->authHeaders($empresaUser))
            ->postJson('/api/solicitacoes', array_merge($valid, ['id_autonomo' => 999999]))
            ->assertUnprocessable();
    }

    public function test_solicitacoes_are_isolated_include_relations_and_have_scoped_update_delete(): void
    {
        $empresa1 = $this->makeEmpresa();
        $user1 = $this->makeEmpresaUser($empresa1);
        $empresa2 = $this->makeEmpresa();
        $user2 = $this->makeEmpresaUser($empresa2);
        $autonomo = $this->makeAutonomo();
        $autonomoUser = $this->makeAutonomoUser($autonomo);
        $servico = $this->makeServico();
        $request1 = $this->makeSolicitacao([
            'id_empresa' => $empresa1->id,
            'id_servico' => $servico->id,
            'id_autonomo' => $autonomo->id,
            'status' => 'Concluída',
        ]);
        $request2 = $this->makeSolicitacao([
            'id_empresa' => $empresa2->id,
            'id_servico' => $servico->id,
            'id_autonomo' => $autonomo->id,
            'status' => 'Pendente',
        ]);
        $avaliacao = $this->makeAvaliacao($request1);
        $pagamento = $this->makePagamento($request1);

        $index1 = $this->withHeaders($this->authHeaders($user1))
            ->getJson('/api/solicitacoes')
            ->assertOk();
        $this->assertSame([$request1->id], array_column($index1->json(), 'id'));
        $this->withHeaders($this->authHeaders($user1))
            ->getJson('/api/solicitacoes/' . $request1->id)
            ->assertOk()
            ->assertJsonPath('avaliacao.id', $avaliacao->id)
            ->assertJsonPath('pagamentos.0.id', $pagamento->id);
        $this->assertForbiddenOrMissing(
            $this->withHeaders($this->authHeaders($user1))
                ->getJson('/api/solicitacoes/' . $request2->id)
        );

        $indexAuto = $this->withHeaders($this->authHeaders($autonomoUser))
            ->getJson('/api/solicitacoes')
            ->assertOk();
        $this->assertEqualsCanonicalizing([$request1->id, $request2->id], array_column($indexAuto->json(), 'id'));

        $this->assertStatusIn(
            $this->withHeaders($this->authHeaders($user1))
                ->putJson('/api/solicitacoes/' . $request1->id, [
                    'id_empresa' => $empresa2->id,
                ]),
            [200, 422]
        );
        $this->assertDatabaseHas('solicitacoes', [
            'id' => $request1->id,
            'id_empresa' => $empresa1->id,
        ]);
        $this->withHeaders($this->authHeaders($user1))
            ->putJson('/api/solicitacoes/' . $request1->id, [
                'status' => 'Finalizada',
                'descricao_problema' => 'Descrição atualizada pela dona.',
            ])
            ->assertOk();
        $this->assertDatabaseHas('solicitacoes', [
            'id' => $request1->id,
            'id_empresa' => $empresa1->id,
            'status' => 'Finalizada',
            'descricao_problema' => 'Descrição atualizada pela dona.',
        ]);

        $this->assertStatusIn(
            $this->withHeaders($this->authHeaders($autonomoUser))
                ->putJson('/api/solicitacoes/' . $request2->id, [
                    'descricao_problema' => 'Não deve ser alterada pelo profissional.',
                    'id_empresa' => $empresa1->id,
                ]),
            [200, 422]
        );
        $this->withHeaders($this->authHeaders($autonomoUser))
            ->putJson('/api/solicitacoes/' . $request2->id, [
                'status' => 'Em andamento',
                'data_inicio' => '2026-10-21',
                'data_fim' => '2026-10-22',
            ])
            ->assertOk();
        $this->assertDatabaseHas('solicitacoes', [
            'id' => $request2->id,
            'status' => 'Em andamento',
            'id_empresa' => $empresa2->id,
            'descricao_problema' => 'Problema descrito no fixture',
        ]);
        $this->assertSame('2026-10-21', $request2->fresh()->data_inicio->toDateString());
        $this->assertSame('2026-10-22', $request2->fresh()->data_fim->toDateString());

        $this->assertForbiddenOrMissing(
            $this->withHeaders($this->authHeaders($autonomoUser))
                ->deleteJson('/api/solicitacoes/' . $request1->id)
        );
        $this->assertForbiddenOrMissing(
            $this->withHeaders($this->authHeaders($user2))
                ->putJson('/api/solicitacoes/' . $request1->id, ['status' => 'Tentativa'])
        );

        $this->withHeaders($this->authHeaders($user1))
            ->deleteJson('/api/solicitacoes/' . $request1->id)
            ->assertOk();
        $this->assertDatabaseMissing('solicitacoes', ['id' => $request1->id]);
        $this->assertDatabaseMissing('avaliacoes', ['id' => $avaliacao->id]);
        $this->assertDatabaseMissing('pagamentos', ['id' => $pagamento->id]);
    }

    public function test_pagamento_crud_is_limited_to_the_request_owning_empresa_and_link_is_immutable(): void
    {
        $empresa = $this->makeEmpresa();
        $owner = $this->makeEmpresaUser($empresa);
        $other = $this->makeEmpresaUser($this->makeEmpresa());
        $autonomoUser = $this->makeAutonomoUser($this->makeAutonomo());
        $request = $this->makeSolicitacao(['id_empresa' => $empresa->id]);
        $otherRequest = $this->makeSolicitacao(['id_empresa' => $other->empresa_id]);

        $this->withHeaders($this->authHeaders($owner))
            ->postJson('/api/pagamentos', [
                'valor' => 100,
                'metodo' => 'pix',
                'status' => 'pago',
            ])->assertUnprocessable();
        $this->withHeaders($this->authHeaders($owner))
            ->postJson('/api/pagamentos', [
                'id_solicitacao' => 999999,
                'valor' => 100,
                'metodo' => 'pix',
            ])->assertUnprocessable();
        $this->withHeaders($this->authHeaders($owner))
            ->postJson('/api/pagamentos', [
                'id_solicitacao' => $request->id,
                'valor' => -0.01,
                'metodo' => 'pix',
            ])->assertUnprocessable();

        $created = $this->withHeaders($this->authHeaders($owner))
            ->postJson('/api/pagamentos', [
                'id_solicitacao' => $request->id,
                'valor' => 100,
                'metodo' => 'cartao',
                'status' => 'pago',
            ])->assertCreated();
        $paymentId = $created->json('id');
        $this->withHeaders($this->authHeaders($owner))->getJson('/api/pagamentos')->assertOk();
        $this->withHeaders($this->authHeaders($owner))->getJson('/api/pagamentos/' . $paymentId)->assertOk();
        $this->assertForbiddenOrMissing(
            $this->withHeaders($this->authHeaders($other))->getJson('/api/pagamentos/' . $paymentId)
        );
        $this->assertForbiddenOrMissing(
            $this->withHeaders($this->authHeaders($autonomoUser))->getJson('/api/pagamentos/' . $paymentId)
        );

        $this->assertStatusIn(
            $this->withHeaders($this->authHeaders($owner))
                ->putJson('/api/pagamentos/' . $paymentId, [
                    'id_solicitacao' => $otherRequest->id,
                ]),
            [200, 409, 422]
        );
        $this->assertDatabaseHas('pagamentos', [
            'id' => $paymentId,
            'id_solicitacao' => $request->id,
        ]);
        $this->withHeaders($this->authHeaders($owner))
            ->putJson('/api/pagamentos/' . $paymentId, [
                'valor' => 120.50,
                'metodo' => 'pix',
                'status' => 'estornado',
            ])->assertOk();
        $this->assertDatabaseHas('pagamentos', [
            'id' => $paymentId,
            'id_solicitacao' => $request->id,
            'valor' => '120.50',
            'metodo' => 'pix',
            'status' => 'estornado',
        ]);
        $this->assertForbiddenOrMissing(
            $this->withHeaders($this->authHeaders($other))
                ->putJson('/api/pagamentos/' . $paymentId, ['valor' => 1])
        );
        $this->withHeaders($this->authHeaders($owner))
            ->deleteJson('/api/pagamentos/' . $paymentId)
            ->assertOk();
        $this->assertDatabaseMissing('pagamentos', ['id' => $paymentId]);
    }

    public function test_avaliacao_validates_note_and_link_duplicate_and_is_scoped_to_completed_empresa_request(): void
    {
        $empresa = $this->makeEmpresa();
        $owner = $this->makeEmpresaUser($empresa);
        $other = $this->makeEmpresaUser($this->makeEmpresa());
        $autonomoUser = $this->makeAutonomoUser($this->makeAutonomo());
        $completed = $this->makeSolicitacao(['id_empresa' => $empresa->id, 'status' => 'Concluída']);
        $otherRequest = $this->makeSolicitacao(['id_empresa' => $other->empresa_id, 'status' => 'Finalizada']);
        $pending = $this->makeSolicitacao(['id_empresa' => $empresa->id, 'status' => 'Pendente']);

        foreach ([null, 0, 6, 3.5] as $nota) {
            $payload = [
                'id_solicitacao' => $completed->id,
                'nota' => $nota,
                'comentarios' => 'Nota inválida',
            ];
            $this->withHeaders($this->authHeaders($owner))
                ->postJson('/api/avaliacoes', $payload)
                ->assertUnprocessable();
        }
        $this->withHeaders($this->authHeaders($owner))
            ->postJson('/api/avaliacoes', ['nota' => 5, 'comentarios' => 'Sem vínculo'])
            ->assertUnprocessable();
        $this->withHeaders($this->authHeaders($owner))
            ->postJson('/api/avaliacoes', [
                'id_solicitacao' => 999999, 'nota' => 5,
            ])->assertUnprocessable();
        $this->assertStatusIn(
            $this->withHeaders($this->authHeaders($owner))
                ->postJson('/api/avaliacoes', [
                    'id_solicitacao' => $pending->id,
                    'nota' => 5,
                    'comentarios' => 'Ainda não concluído',
                ]),
            [403, 404, 422]
        );

        $created = $this->withHeaders($this->authHeaders($owner))
            ->postJson('/api/avaliacoes', [
                'id_solicitacao' => $completed->id,
                'nota' => 4,
                'comentarios' => 'Bom trabalho.',
            ])->assertCreated();
        $evaluationId = $created->json('id');
        $this->withHeaders($this->authHeaders($owner))
            ->postJson('/api/avaliacoes', [
                'id_solicitacao' => $completed->id, 'nota' => 3,
            ])->assertStatus(409);

        $this->withHeaders($this->authHeaders($owner))->getJson('/api/avaliacoes')->assertOk();
        $this->withHeaders($this->authHeaders($owner))->getJson('/api/avaliacoes/' . $evaluationId)->assertOk();
        $this->assertForbiddenOrMissing(
            $this->withHeaders($this->authHeaders($other))->getJson('/api/avaliacoes/' . $evaluationId)
        );
        $this->assertForbiddenOrMissing(
            $this->withHeaders($this->authHeaders($autonomoUser))
                ->getJson('/api/avaliacoes/' . $evaluationId)
        );

        $this->assertStatusIn(
            $this->withHeaders($this->authHeaders($owner))
                ->putJson('/api/avaliacoes/' . $evaluationId, [
                    'id_solicitacao' => $otherRequest->id,
                ]),
            [200, 409, 422]
        );
        $this->withHeaders($this->authHeaders($owner))
            ->putJson('/api/avaliacoes/' . $evaluationId, [
                'nota' => 5,
                'comentarios' => 'Atualizado sem mover vínculo.',
            ])->assertOk();
        $this->assertDatabaseHas('avaliacoes', [
            'id' => $evaluationId,
            'id_solicitacao' => $completed->id,
            'nota' => 5,
            'comentarios' => 'Atualizado sem mover vínculo.',
        ]);
        $this->assertForbiddenOrMissing(
            $this->withHeaders($this->authHeaders($other))
                ->deleteJson('/api/avaliacoes/' . $evaluationId)
        );
        $this->withHeaders($this->authHeaders($owner))
            ->deleteJson('/api/avaliacoes/' . $evaluationId)
            ->assertOk();
        $this->assertDatabaseMissing('avaliacoes', ['id' => $evaluationId]);
    }
}
