<?php

namespace App\Http\Controllers;

use App\Models\Solicitacao;
use App\Models\Autonomo;
use App\Models\Servico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class SolicitacaoController extends Controller
{
    private const RELATIONS = ['empresa', 'servico', 'autonomo', 'avaliacao', 'pagamentos'];

    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['mensagem' => 'É necessário estar autenticado.'], 401);
        if ($user->tipo !== 'empresa' || !$user->empresa_id) {
            return response()->json(['mensagem' => 'Apenas empresas podem criar solicitações.'], 403);
        }

        $dados = Validator::make($this->payload($request), $this->createRules())->validate();
        $dados['status'] = $this->normalizeStatus($dados['status'] ?? null);
        $dados['data_solicitacao'] = $dados['data_solicitacao'] ?? now()->toDateString();
        // A empresa é sempre a empresa vinculada ao token, nunca um valor do cliente.
        $dados['id_empresa'] = $user->empresa_id;

        $servico = Servico::findOrFail($dados['id_servico']);
        $areas = array_unique(array_filter([
            $this->statusKey((string) $servico->categoria),
            $this->statusKey((string) $servico->nome),
            $this->statusKey((string) ($dados['tipo_servico'] ?? '')),
        ]));
        $autonomos = Autonomo::query()->where('ativo', true)->get()->filter(function (Autonomo $autonomo) use ($areas) {
            // O vínculo auxiliar não deve ampliar o público para uma profissão
            // diferente da categoria/nome do serviço selecionado.
            return in_array($this->statusKey((string) $autonomo->especialidade), $areas, true);
        })->values();
        if ($autonomos->isEmpty()) {
            return response()->json(['mensagem' => 'Não há autônomos ativos cadastrados nesta área.'], 422);
        }
        $solicitacoes = DB::transaction(function () use ($dados, $autonomos) {
            return $autonomos->map(function (Autonomo $autonomo) use ($dados) {
                $registro = $dados;
                $registro['id_autonomo'] = $autonomo->id;
                return Solicitacao::create($registro);
            });
        });
        $resposta = $this->prepared($solicitacoes->first())->toArray();
        $resposta['quantidade_destinatarios'] = $solicitacoes->count();
        $resposta['destinatarios'] = $autonomos->map(fn (Autonomo $autonomo) => [
            'id' => $autonomo->id, 'nome' => $autonomo->nome,
        ])->values()->all();
        return response()->json($resposta, 201);
    }

    public function index(Request $request)
    {
        $items = $this->scopedQuery($request)->with(self::RELATIONS)->latest('id')->get();
        $items->each(fn (Solicitacao $item) => $this->canonicalize($item));
        return response()->json($items, 200);
    }

    public function show(Request $request, $id)
    {
        $item = $this->scopedQuery($request)->with(self::RELATIONS)->whereKey($id)->firstOrFail();
        return response()->json($this->canonicalize($item), 200);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) return response()->json(['mensagem' => 'É necessário estar autenticado.'], 401);

        $item = $this->scopedQuery($request)
            ->with(self::RELATIONS)
            ->whereKey($id)
            ->firstOrFail();
        $payload = $this->payload($request);

        $isEmpresa = $user->tipo === 'empresa';
        $allowed = $isEmpresa
            ? ['data_solicitacao', 'descricao_problema', 'status', 'id_servico', 'id_autonomo', 'data_inicio', 'data_fim',
                'nome_contato', 'empresa_contato', 'local_atendimento', 'telefone_contato', 'tipo_servico', 'prioridade', 'preco_estimado']
            : ['status', 'data_inicio', 'data_fim'];
        // Vínculos/campos fora do papel da conta são deliberadamente ignorados:
        // nunca entram no update, mas requests antigos da UI continuam retornando 200.
        $payload = array_intersect_key($payload, array_flip($allowed));

        $rules = [
            'status' => ['sometimes', 'nullable', 'string', 'max:30'],
            'data_inicio' => ['sometimes', 'nullable', 'date'],
            'data_fim' => ['sometimes', 'nullable', 'date'],
        ];
        if ($isEmpresa) {
            $rules += [
                'data_solicitacao' => ['sometimes', 'date'],
                'descricao_problema' => ['sometimes', 'required', 'string'],
                'id_servico' => ['sometimes', 'integer', 'exists:servicos,id'],
                'id_autonomo' => ['sometimes', 'nullable', 'integer', 'exists:autonomos,id'],
                'nome_contato' => ['sometimes', 'nullable', 'string', 'max:100'],
                'empresa_contato' => ['sometimes', 'nullable', 'string', 'max:100'],
                'local_atendimento' => ['sometimes', 'nullable', 'string', 'max:150'],
                'telefone_contato' => ['sometimes', 'nullable', 'string', 'max:20'],
                'tipo_servico' => ['sometimes', 'nullable', 'string', 'max:100'],
                'prioridade' => ['sometimes', 'nullable', 'string', 'max:20'],
                'preco_estimado' => ['sometimes', 'nullable', 'numeric', 'decimal:0,2', 'between:0,99999999.99'],
            ];
        }
        $dados = Validator::make($payload, $rules)->validate();
        if (array_key_exists('status', $dados)) $dados['status'] = $this->normalizeStatus($dados['status']);

        if ($item->avaliacao) {
            if (array_key_exists('id_servico', $dados) && (int) $dados['id_servico'] !== (int) $item->id_servico) {
                return response()->json(['mensagem' => 'O serviço não pode ser alterado depois da avaliação.'], 409);
            }
            if (array_key_exists('id_autonomo', $dados) && $this->differentNullableId($dados['id_autonomo'], $item->id_autonomo)) {
                return response()->json(['mensagem' => 'O profissional não pode ser alterado depois da avaliação.'], 409);
            }
            if (array_key_exists('status', $dados) && !in_array($dados['status'], ['Finalizada'], true)) {
                return response()->json(['mensagem' => 'Uma solicitação avaliada não pode ser reaberta.'], 409);
            }
        }

        $item->update($dados);
        return response()->json($this->prepared($item->fresh()), 200);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) return response()->json(['mensagem' => 'É necessário estar autenticado.'], 401);
        if ($user->tipo !== 'empresa' || !$user->empresa_id) {
            return response()->json(['mensagem' => 'Apenas a empresa dona pode apagar a solicitação.'], 403);
        }
        $item = Solicitacao::where('id_empresa', $user->empresa_id)->whereKey($id)->firstOrFail();
        $item->delete();
        return response()->json(['mensagem' => 'Solicitação apagada com sucesso.'], 200);
    }

    private function createRules(): array
    {
        return [
            'id_servico' => ['required', 'integer', 'exists:servicos,id'],
            'id_autonomo' => ['sometimes', 'nullable', 'integer', 'exists:autonomos,id'],
            'descricao_problema' => ['required', 'string'],
            'data_solicitacao' => ['sometimes', 'nullable', 'date'],
            'status' => ['sometimes', 'nullable', 'string', 'max:30'],
            'data_inicio' => ['sometimes', 'nullable', 'date'],
            'data_fim' => ['sometimes', 'nullable', 'date'],
            'nome_contato' => ['sometimes', 'nullable', 'string', 'max:100'],
            'empresa_contato' => ['sometimes', 'nullable', 'string', 'max:100'],
            'local_atendimento' => ['sometimes', 'nullable', 'string', 'max:150'],
            'telefone_contato' => ['sometimes', 'nullable', 'string', 'max:20'],
            'tipo_servico' => ['sometimes', 'nullable', 'string', 'max:100'],
            'prioridade' => ['sometimes', 'nullable', 'string', 'max:20'],
            'preco_estimado' => ['sometimes', 'nullable', 'numeric', 'decimal:0,2', 'between:0,99999999.99'],
        ];
    }

    private function payload(Request $request): array
    {
        $payload = $request->all();
        // Compatibilidade com a UI antiga que chamava o campo de estado.
        if (array_key_exists('estado', $payload) && !array_key_exists('status', $payload)) $payload['status'] = $payload['estado'];
        unset($payload['estado']);
        return $payload;
    }

    private function scopedQuery(Request $request)
    {
        $user = $request->user();
        if (!$user) abort(401, 'É necessário estar autenticado.');
        if ($user->tipo === 'empresa' && $user->empresa_id) return Solicitacao::where('id_empresa', $user->empresa_id);
        if ($user->tipo === 'autonomo' && $user->autonomo_id) return Solicitacao::where('id_autonomo', $user->autonomo_id);
        return Solicitacao::whereRaw('1 = 0');
    }

    private function normalizeStatus(?string $status): string
    {
        if ($status === null || trim($status) === '') return 'Pendente';
        $key = $this->statusKey($status);
        $aliases = [
            'pendente' => 'Pendente', 'aberta' => 'Aberta', 'em andamento' => 'Em andamento',
            'emandamento' => 'Em andamento', 'concluida' => 'Finalizada', 'concluido' => 'Finalizada',
            'finalizada' => 'Finalizada', 'finalizado' => 'Finalizada',
            'nao aceita' => 'Não aceita', 'naoaceita' => 'Não aceita', 'cancelada' => 'Cancelada',
        ];
        if (!isset($aliases[$key])) throw ValidationException::withMessages(['status' => 'O status informado não é válido.']);
        return $aliases[$key];
    }

    private function canonicalize(Solicitacao $item): Solicitacao
    {
        if ($item->status !== null) {
            $aliases = [
                'pendente' => 'Pendente', 'aberta' => 'Aberta', 'em andamento' => 'Em andamento',
                'emandamento' => 'Em andamento', 'concluida' => 'Finalizada', 'concluido' => 'Finalizada',
                'finalizada' => 'Finalizada', 'finalizado' => 'Finalizada',
                'nao aceita' => 'Não aceita', 'naoaceita' => 'Não aceita', 'cancelada' => 'Cancelada',
            ];
            $key = $this->statusKey((string) $item->status);
            if (isset($aliases[$key])) $item->status = $aliases[$key];
        }
        return $item;
    }

    private function statusKey(string $status): string
    {
        $key = mb_strtolower(trim($status), 'UTF-8');
        $key = str_replace(['_', '-'], ' ', $key);
        $ascii = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $key);
        return trim(preg_replace('/\s+/', ' ', $ascii !== false ? $ascii : $key));
    }

    private function prepared(Solicitacao $item): Solicitacao
    {
        return $this->canonicalize($item->load(self::RELATIONS));
    }

    private function differentNullableId($new, $old): bool
    {
        if ($new === null || $new === '') return $old !== null;
        return (int) $new !== (int) $old;
    }
}
