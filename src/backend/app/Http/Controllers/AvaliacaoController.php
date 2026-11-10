<?php

namespace App\Http\Controllers;

use App\Models\Avaliacao;
<<<<<<< HEAD
use App\Models\Solicitacao;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Validator;

class AvaliacaoController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['mensagem' => 'É necessário estar autenticado.'], 401);
        if ($user->tipo !== 'empresa' || !$user->empresa_id) return response()->json(['mensagem' => 'Apenas empresas podem criar avaliações.'], 403);

        $dados = Validator::make($request->all(), [
            'id_solicitacao' => ['required', 'integer', 'exists:solicitacoes,id'],
            'nota' => ['required', 'integer', 'between:1,5'],
            'comentarios' => ['sometimes', 'nullable', 'string', 'max:5000'],
        ])->validate();
        $solicitacao = Solicitacao::where('id_empresa', $user->empresa_id)->whereKey($dados['id_solicitacao'])->first();
        if (!$solicitacao) return response()->json(['mensagem' => 'Solicitação não encontrada para esta empresa.'], 404);
        if (!in_array($this->canonicalStatus($solicitacao->status), ['Finalizada'], true)) {
            return response()->json(['mensagem' => 'A solicitação precisa estar Finalizada para ser avaliada.'], 422);
        }
        if (Avaliacao::where('id_solicitacao', $solicitacao->id)->exists()) {
            return response()->json(['mensagem' => 'Esta solicitação já possui uma avaliação.'], 409);
        }

        try {
            $avaliacao = Avaliacao::create($dados);
        } catch (QueryException $exception) {
            $message = strtolower($exception->getMessage());
            if (str_contains($message, 'unique') || str_contains($message, 'duplicate')) {
                return response()->json(['mensagem' => 'Esta solicitação já possui uma avaliação.'], 409);
            }
            throw $exception;
        }
        return response()->json($avaliacao->load(['solicitacao.empresa', 'solicitacao.servico', 'solicitacao.autonomo']), 201);
    }

    public function index(Request $request)
    {
        $items = $this->scopedQuery($request)->with([
            'solicitacao.empresa', 'solicitacao.servico', 'solicitacao.autonomo', 'solicitacao.pagamentos',
        ])->latest('id')->get();
        return response()->json($items, 200);
    }

    public function show(Request $request, $id)
    {
        $item = $this->scopedQuery($request)->with([
            'solicitacao.empresa', 'solicitacao.servico', 'solicitacao.autonomo', 'solicitacao.pagamentos',
        ])->whereKey($id)->firstOrFail();
        return response()->json($item, 200);
    }

    public function update(Request $request, $id)
    {
        $item = $this->ownedQuery($request)->whereKey($id)->firstOrFail();
        $dados = Validator::make($request->all(), [
            'nota' => ['sometimes', 'integer', 'between:1,5'],
            'comentarios' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'id_solicitacao' => ['sometimes', 'nullable', 'integer', 'exists:solicitacoes,id'],
        ])->validate();
        // O vínculo é imutável; compatibilidade com payload antigo não deve mover a avaliação.
        unset($dados['id_solicitacao']);
        $item->update($dados);
        return response()->json($item->fresh()->load(['solicitacao.empresa', 'solicitacao.servico', 'solicitacao.autonomo']), 200);
    }

    public function destroy(Request $request, $id)
    {
        $item = $this->ownedQuery($request)->whereKey($id)->firstOrFail();
        $item->delete();
        return response()->json(['mensagem' => 'Avaliação apagada com sucesso.'], 200);
    }

    private function scopedQuery(Request $request)
    {
        $user = $request->user();
        if (!$user) abort(401, 'É necessário estar autenticado.');
        return Avaliacao::whereHas('solicitacao', function ($query) use ($user) {
            if ($user->tipo === 'empresa' && $user->empresa_id) $query->where('id_empresa', $user->empresa_id);
            elseif ($user->tipo === 'autonomo' && $user->autonomo_id) $query->where('id_autonomo', $user->autonomo_id);
            else $query->whereRaw('1 = 0');
        });
    }

    private function ownedQuery(Request $request)
    {
        $user = $request->user();
        if (!$user) abort(401, 'É necessário estar autenticado.');
        if ($user->tipo !== 'empresa' || !$user->empresa_id) abort(403, 'Apenas a empresa dona pode alterar avaliações.');
        return Avaliacao::whereHas('solicitacao', fn ($query) => $query->where('id_empresa', $user->empresa_id));
    }

    private function canonicalStatus(?string $status): ?string
    {
        if ($status === null) return null;
        $key = mb_strtolower(trim($status), 'UTF-8');
        $key = str_replace(['_', '-'], ' ', $key);
        $ascii = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $key);
        $key = trim(preg_replace('/\s+/', ' ', $ascii !== false ? $ascii : $key));
        return ['concluida' => 'Finalizada', 'concluido' => 'Finalizada', 'finalizada' => 'Finalizada', 'finalizado' => 'Finalizada'][$key] ?? $status;
    }
=======
use Illuminate\Http\Request;

class AvaliacaoController extends Controller
{
    // CREATE
    public function store(Request $request)
    {
        $avaliacao = Avaliacao::create($request->all());

        return response()->json($avaliacao, 201);
    }

    // READ ALL
    public function index()
    {
        $avaliacoes = Avaliacao::all();

        return response()->json($avaliacoes, 200);
    }

    // READ ONE
    public function show($id)
    {
        $avaliacao = Avaliacao::findOrFail($id);

        return response()->json($avaliacao, 200);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $avaliacao = Avaliacao::findOrFail($id);

        $avaliacao->update($request->all());

        return response()->json($avaliacao, 200);
    }

    // DELETE
    public function destroy($id)
    {
        $avaliacao = Avaliacao::findOrFail($id);

        $avaliacao->delete();

        return response()->json([
            'mensagem' => 'Avaliação apagada com sucesso.'
        ], 200);
    }
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871
}
