<?php

namespace Tests\Feature;

use App\Models\Servico;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\Feature\Support\ApiFixtures;
use Tests\TestCase;

class NotificationsAndRepliesTest extends TestCase
{
    use RefreshDatabase;
    use ApiFixtures;

    private function abrirChamado($empresaUser, $autonomo, array $extra = [])
    {
        return $this->withHeaders($this->authHeaders($empresaUser))->postJson('/api/solicitacoes', array_merge([
            'id_autonomo' => $autonomo->id,
            'descricao_problema' => 'Tomada sem energia na sala 2',
            'tipo_servico' => 'Elétrica',
        ], $extra));
    }

    public function test_new_request_notifies_only_the_assigned_autonomo(): void
    {
        $empresaUser = $this->makeEmpresaUser();
        $autonomo = $this->makeAutonomo();
        $autonomoUser = $this->makeAutonomoUser($autonomo);
        $outroUser = $this->makeAutonomoUser();

        $resposta = $this->abrirChamado($empresaUser, $autonomo)->assertCreated();

        $this->assertDatabaseHas('notificacoes', [
            'user_id' => $autonomoUser->id,
            'id_solicitacao' => $resposta->json('id'),
            'tipo' => 'novo_pedido',
            'lida_em' => null,
        ]);
        $this->assertDatabaseMissing('notificacoes', ['user_id' => $outroUser->id]);
        $this->assertDatabaseMissing('notificacoes', ['user_id' => $empresaUser->id]);

        $this->withHeaders($this->authHeaders($autonomoUser))->getJson('/api/notificacoes/contagem')
            ->assertOk()->assertJsonPath('nao_lidas', 1);
        $this->withHeaders($this->authHeaders($outroUser))->getJson('/api/notificacoes/contagem')
            ->assertOk()->assertJsonPath('nao_lidas', 0);
    }

    public function test_autonomo_can_list_and_mark_notifications_as_read(): void
    {
        $empresaUser = $this->makeEmpresaUser();
        $autonomo = $this->makeAutonomo();
        $autonomoUser = $this->makeAutonomoUser($autonomo);
        $this->abrirChamado($empresaUser, $autonomo)->assertCreated();
        $this->abrirChamado($empresaUser, $autonomo)->assertCreated();

        $lista = $this->withHeaders($this->authHeaders($autonomoUser))
            ->getJson('/api/notificacoes?apenas_nao_lidas=1')->assertOk();
        $this->assertCount(2, $lista->json());

        $primeira = $lista->json('0.id');
        $this->withHeaders($this->authHeaders($autonomoUser))->postJson("/api/notificacoes/{$primeira}/lida")->assertOk();
        $this->withHeaders($this->authHeaders($autonomoUser))->getJson('/api/notificacoes/contagem')
            ->assertJsonPath('nao_lidas', 1);

        $this->withHeaders($this->authHeaders($autonomoUser))->postJson('/api/notificacoes/ler-todas')->assertOk();
        $this->withHeaders($this->authHeaders($autonomoUser))->getJson('/api/notificacoes/contagem')
            ->assertJsonPath('nao_lidas', 0);
    }

    public function test_notifications_are_private_and_require_authentication(): void
    {
        $empresaUser = $this->makeEmpresaUser();
        $autonomo = $this->makeAutonomo();
        $autonomoUser = $this->makeAutonomoUser($autonomo);
        $outroUser = $this->makeAutonomoUser();
        $this->abrirChamado($empresaUser, $autonomo)->assertCreated();
        $id = $this->withHeaders($this->authHeaders($autonomoUser))->getJson('/api/notificacoes')->json('0.id');

        $this->getJson('/api/notificacoes')->assertUnauthorized();
        $this->getJson('/api/notificacoes/contagem')->assertUnauthorized();
        $this->withHeaders($this->authHeaders($outroUser))->postJson("/api/notificacoes/{$id}/lida")->assertNotFound();
    }

    public function test_reassigning_a_request_notifies_the_new_autonomo(): void
    {
        $empresaUser = $this->makeEmpresaUser();
        $primeiro = $this->makeAutonomo();
        $segundo = $this->makeAutonomo();
        $segundoUser = $this->makeAutonomoUser($segundo);
        $id = $this->abrirChamado($empresaUser, $primeiro)->assertCreated()->json('id');

        $this->withHeaders($this->authHeaders($empresaUser))
            ->putJson("/api/solicitacoes/{$id}", ['id_autonomo' => $segundo->id])->assertOk();

        $this->assertDatabaseHas('notificacoes', ['user_id' => $segundoUser->id, 'id_solicitacao' => $id]);
    }

    public function test_autonomo_can_accept_a_request_with_a_reply(): void
    {
        $empresaUser = $this->makeEmpresaUser();
        $autonomo = $this->makeAutonomo();
        $autonomoUser = $this->makeAutonomoUser($autonomo);
        $id = $this->abrirChamado($empresaUser, $autonomo)->assertCreated()->json('id');

        $this->withHeaders($this->authHeaders($autonomoUser))
            ->postJson("/api/solicitacoes/{$id}/responder", ['acao' => 'aceitar', 'mensagem' => 'Posso ir amanhã às 9h.'])
            ->assertOk()
            ->assertJsonPath('solicitacao.status', 'Em andamento')
            ->assertJsonPath('solicitacao.resposta_autonomo', 'Posso ir amanhã às 9h.');

        $this->assertDatabaseHas('solicitacoes', ['id' => $id, 'status' => 'Em andamento', 'resposta_autonomo' => 'Posso ir amanhã às 9h.']);
        $this->assertNotNull(\App\Models\Solicitacao::find($id)->respondida_em);

        $this->withHeaders($this->authHeaders($autonomoUser))
            ->postJson("/api/solicitacoes/{$id}/responder", ['acao' => 'recusar'])
            ->assertStatus(409);
    }

    public function test_autonomo_can_decline_a_request(): void
    {
        $empresaUser = $this->makeEmpresaUser();
        $autonomo = $this->makeAutonomo();
        $autonomoUser = $this->makeAutonomoUser($autonomo);
        $id = $this->abrirChamado($empresaUser, $autonomo)->assertCreated()->json('id');

        $this->withHeaders($this->authHeaders($autonomoUser))
            ->postJson("/api/solicitacoes/{$id}/responder", ['acao' => 'recusar', 'mensagem' => 'Agenda cheia.'])
            ->assertOk()
            ->assertJsonPath('solicitacao.status', 'Não aceita');
        $this->assertDatabaseHas('solicitacoes', ['id' => $id, 'status' => 'Não aceita', 'resposta_autonomo' => 'Agenda cheia.']);
    }

    public function test_only_the_assigned_autonomo_can_reply_and_the_action_is_validated(): void
    {
        $empresaUser = $this->makeEmpresaUser();
        $autonomo = $this->makeAutonomo();
        $autonomoUser = $this->makeAutonomoUser($autonomo);
        $outroUser = $this->makeAutonomoUser();
        $id = $this->abrirChamado($empresaUser, $autonomo)->assertCreated()->json('id');

        $this->withHeaders($this->authHeaders($empresaUser))
            ->postJson("/api/solicitacoes/{$id}/responder", ['acao' => 'aceitar'])->assertForbidden();
        $this->withHeaders($this->authHeaders($outroUser))
            ->postJson("/api/solicitacoes/{$id}/responder", ['acao' => 'aceitar'])->assertNotFound();
        $this->withHeaders($this->authHeaders($autonomoUser))
            ->postJson("/api/solicitacoes/{$id}/responder", ['acao' => 'talvez'])->assertUnprocessable();
        $this->postJson("/api/solicitacoes/{$id}/responder", ['acao' => 'aceitar'])->assertUnauthorized();
    }

    public function test_autonomo_cannot_create_evaluations(): void
    {
        $empresaUser = $this->makeEmpresaUser();
        $autonomo = $this->makeAutonomo();
        $autonomoUser = $this->makeAutonomoUser($autonomo);
        $id = $this->abrirChamado($empresaUser, $autonomo)->assertCreated()->json('id');
        \App\Models\Solicitacao::whereKey($id)->update(['status' => 'Concluída']);

        $this->withHeaders($this->authHeaders($autonomoUser))
            ->postJson('/api/avaliacoes', ['id_solicitacao' => $id, 'nota' => 5])->assertForbidden();
    }

    public function test_request_without_service_id_is_resolved_from_the_service_type(): void
    {
        $empresaUser = $this->makeEmpresaUser();
        $autonomo = $this->makeAutonomo();
        $eletrica = Servico::where('nome', 'Elétrica')->firstOrFail();

        $this->abrirChamado($empresaUser, $autonomo)->assertCreated()->assertJsonPath('id_servico', $eletrica->id);

        $outro = $this->abrirChamado($empresaUser, $autonomo, ['tipo_servico' => 'Qualquer coisa'])->assertCreated();
        $this->assertDatabaseHas('servicos', ['id' => $outro->json('id_servico'), 'nome' => 'Outros']);

        $this->withHeaders($this->authHeaders($empresaUser))->postJson('/api/solicitacoes', [
            'id_autonomo' => $autonomo->id,
            'descricao_problema' => 'Sem serviço nem tipo',
        ])->assertUnprocessable();
    }

    public function test_profile_photo_is_served_through_the_api(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('profile-photos/7/abc123.png', 'conteudo');

        $this->get('/api/fotos/7/abc123.png')->assertOk();
        $this->get('/api/fotos/7/inexistente.png')->assertNotFound();
        $this->get('/api/fotos/7/.oculto')->assertNotFound();
    }
}
