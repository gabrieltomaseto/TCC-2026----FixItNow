<?php

namespace App\Http\Controllers;

use App\Models\Pagamento;
<<<<<<< HEAD
use App\Models\Solicitacao;
=======
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PagamentoController extends Controller
{
<<<<<<< HEAD
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['mensagem' => 'É necessário estar autenticado.'], 401);
        if ($user->tipo !== 'empresa' || !$user->empresa_id) return response()->json(['mensagem' => 'Apenas empresas podem registrar pagamentos.'], 403);

        $dados = Validator::make($request->all(), [
            'id_solicitacao' => ['required', 'integer', 'exists:solicitacoes,id'],
            'valor' => ['required', 'numeric', 'decimal:0,2', 'between:0,99999999.99'],
            'metodo' => ['required', 'string', 'max:50'],
            'status' => ['sometimes', 'string', 'max:30'],
        ])->validate();
        $solicitacao = Solicitacao::where('id_empresa', $user->empresa_id)->whereKey($dados['id_solicitacao'])->first();
        if (!$solicitacao) return response()->json(['mensagem' => 'Solicitação não encontrada para esta empresa.'], 404);
        $dados['status'] = $dados['status'] ?? 'pendente';
        return response()->json($this->withRelations(Pagamento::create($dados)), 201);
    }

    public function index(Request $request)
    {
        return response()->json($this->scopedQuery($request)
            ->with(['solicitacao.empresa', 'solicitacao.servico', 'solicitacao.autonomo'])
            ->latest('id')->get(), 200);
    }

    public function show(Request $request, $id)
    {
        $item = $this->scopedQuery($request)->with(['solicitacao.empresa', 'solicitacao.servico', 'solicitacao.autonomo'])
            ->whereKey($id)->firstOrFail();
        return response()->json($item, 200);
    }

    public function update(Request $request, $id)
    {
        $item = $this->scopedQuery($request)->whereKey($id)->firstOrFail();
        $dados = Validator::make($request->all(), [
            'valor' => ['sometimes', 'numeric', 'decimal:0,2', 'between:0,99999999.99'],
            'metodo' => ['sometimes', 'string', 'max:50'],
            'status' => ['sometimes', 'string', 'max:30'],
            'id_solicitacao' => ['sometimes', 'nullable', 'integer', 'exists:solicitacoes,id'],
        ])->validate();
        // O vínculo é imutável; o campo pode aparecer em payloads antigos, mas nunca é escrito.
        unset($dados['id_solicitacao']);
        $item->update($dados);
        return response()->json($this->withRelations($item->fresh()), 200);
    }

    public function destroy(Request $request, $id)
    {
        $item = $this->scopedQuery($request)->whereKey($id)->firstOrFail();
        $item->delete();
        return response()->json(['mensagem' => 'Pagamento apagado com sucesso.'], 200);
    }

    private function scopedQuery(Request $request)
    {
        $user = $request->user();
        if (!$user) abort(401, 'É necessário estar autenticado.');
        // whereHas exclui registros legados com id_solicitacao nulo, sem atribuí-los a ninguém.
        return Pagamento::whereHas('solicitacao', function ($query) use ($user) {
            if ($user->tipo === 'empresa' && $user->empresa_id) $query->where('id_empresa', $user->empresa_id);
            else $query->whereRaw('1 = 0');
        });
    }

    private function withRelations(Pagamento $item): Pagamento
    {
        return $item->load(['solicitacao.empresa', 'solicitacao.servico', 'solicitacao.autonomo']);
    }
=======
    // CREATE
    public function store(Request $request)
    {
        $pagamento = Pagamento::create($request->all());

        return response()->json($pagamento, 201);
    }

    // READ ALL
    public function index()
    {
        $pagamentos = Pagamento::all();

        return response()->json($pagamentos, 200);
    }

    // READ ONE
    public function show($id)
    {
        $pagamento = Pagamento::findOrFail($id);

        return response()->json($pagamento, 200);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $pagamento = Pagamento::findOrFail($id);

        $pagamento->update($request->all());

        return response()->json($pagamento, 200);
    }

    // DELETE
    public function destroy($id)
    {
        $pagamento = Pagamento::findOrFail($id);

        $pagamento->delete();

        return response()->json([
            'mensagem' => 'Pagamento apagado com sucesso.'
        ], 200);
    }
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871
}
