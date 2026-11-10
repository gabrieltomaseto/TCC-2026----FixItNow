<?php

namespace Tests\Feature\Support;

use App\Models\Avaliacao;
use App\Models\Autonomo;
use App\Models\Empresa;
use App\Models\Pagamento;
use App\Models\Servico;
use App\Models\ServicoAutonomo;
use App\Models\Solicitacao;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Testing\TestResponse;

trait ApiFixtures
{
    protected function makeEmpresa(array $attributes = []): Empresa
    {
        return Empresa::create(array_merge([
            'nome' => 'Empresa ' . Str::upper(Str::random(6)),
            'cnpj' => (string) random_int(10000000000000, 99999999999999),
            'endereco' => 'Rua das Flores, 100',
            'telefone' => '11999990000',
            'email' => 'empresa-' . Str::lower(Str::random(12)) . '@example.test',
        ], $attributes));
    }

    protected function makeAutonomo(array $attributes = []): Autonomo
    {
        return Autonomo::create(array_merge([
            'nome' => 'Profissional ' . Str::upper(Str::random(6)),
            'cpf' => (string) random_int(10000000000, 99999999999),
            'telefone' => '11988880000',
            'email' => 'autonomo-' . Str::lower(Str::random(12)) . '@example.test',
            'especialidade' => 'Eletricista',
            'disponibilidade' => 'Segunda a sexta',
            'ativo' => true,
        ], $attributes));
    }

    protected function makeServico(array $attributes = []): Servico
    {
        return Servico::create(array_merge([
            'nome' => 'Serviço ' . Str::upper(Str::random(6)),
            'descricao' => 'Descrição do serviço de teste',
            'categoria' => 'Manutenção',
            'preco' => 125.50,
            'ativo' => true,
        ], $attributes));
    }

    protected function makeEmpresaUser(?Empresa $empresa = null, array $attributes = []): User
    {
        $empresa ??= $this->makeEmpresa();

        return User::create(array_merge([
            'name' => $empresa->nome,
            'email' => $empresa->email,
            'password' => bcrypt('password'),
            'tipo' => 'empresa',
            'empresa_id' => $empresa->id,
            'autonomo_id' => null,
        ], $attributes));
    }

    protected function makeAutonomoUser(?Autonomo $autonomo = null, array $attributes = []): User
    {
        $autonomo ??= $this->makeAutonomo();

        return User::create(array_merge([
            'name' => $autonomo->nome,
            'email' => $autonomo->email,
            'password' => bcrypt('password'),
            'tipo' => 'autonomo',
            'empresa_id' => null,
            'autonomo_id' => $autonomo->id,
        ], $attributes));
    }

    protected function makeOrphanUser(array $attributes = []): User
    {
        return User::create(array_merge([
            'name' => 'Conta de teste',
            'email' => 'conta-' . Str::lower(Str::random(12)) . '@example.test',
            'password' => bcrypt('password'),
            'tipo' => 'empresa',
            'empresa_id' => null,
            'autonomo_id' => null,
        ], $attributes));
    }

    protected function makeSolicitacao(array $attributes = []): Solicitacao
    {
        $empresa = isset($attributes['id_empresa'])
            ? Empresa::findOrFail($attributes['id_empresa'])
            : $this->makeEmpresa();
        $servico = isset($attributes['id_servico'])
            ? Servico::findOrFail($attributes['id_servico'])
            : $this->makeServico();
        $autonomo = array_key_exists('id_autonomo', $attributes) && $attributes['id_autonomo'] === null
            ? null
            : (isset($attributes['id_autonomo']) ? Autonomo::findOrFail($attributes['id_autonomo']) : $this->makeAutonomo());

        return Solicitacao::create(array_merge([
            'data_solicitacao' => now()->toDateString(),
            'descricao_problema' => 'Problema descrito no fixture',
            'status' => 'Pendente',
            'id_empresa' => $empresa->id,
            'id_servico' => $servico->id,
            'id_autonomo' => $autonomo?->id,
            'data_inicio' => null,
            'data_fim' => null,
        ], $attributes));
    }

    protected function makePagamento(?Solicitacao $solicitacao = null, array $attributes = []): Pagamento
    {
        $solicitacao ??= $this->makeSolicitacao();

        return Pagamento::create(array_merge([
            'id_solicitacao' => $solicitacao->id,
            'valor' => 250.00,
            'metodo' => 'pix',
            'status' => 'pendente',
        ], $attributes));
    }

    protected function makeAvaliacao(?Solicitacao $solicitacao = null, array $attributes = []): Avaliacao
    {
        $solicitacao ??= $this->makeSolicitacao(['status' => 'Concluída']);

        return Avaliacao::create(array_merge([
            'id_solicitacao' => $solicitacao->id,
            'nota' => 5,
            'comentarios' => 'Serviço excelente.',
        ], $attributes));
    }

    protected function makePivot(Servico $servico, Autonomo $autonomo, array $attributes = []): ServicoAutonomo
    {
        return ServicoAutonomo::create(array_merge([
            'id_servico' => $servico->id,
            'id_autonomo' => $autonomo->id,
            'status' => 'ativo',
            'nivel_experiencia' => 'intermediario',
        ], $attributes));
    }

    protected function authHeaders(User $user): array
    {
        // O guard Sanctum é memoizado por aplicação durante o teste; cada request
        // precisa reavaliar o Bearer token quando o usuário muda.
        Auth::forgetGuards();

        return [
            'Accept' => 'application/json',
            'Authorization' => 'Bearer ' . $user->createToken('feature-test')->plainTextToken,
        ];
    }

    protected function fakeImage(string $name, string $mime): UploadedFile
    {
        // File::image() depende de ext-gd, ausente em alguns runners. O fake
        // com MIME explícito é suficiente para as regras image/mimes da API.
        return UploadedFile::fake()->create($name, 1, $mime);
    }

    protected function assertForbiddenOrMissing(TestResponse $response): void
    {
        $this->assertContains($response->status(), [403, 404], 'A resposta deve ocultar ou negar o recurso sem revelar sua existência.');
    }

    protected function assertStatusIn(TestResponse $response, array $statuses): void
    {
        $this->assertContains($response->status(), $statuses, 'Status HTTP inesperado: ' . $response->status());
    }
}
