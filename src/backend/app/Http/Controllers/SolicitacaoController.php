<?php

namespace App\Http\Controllers;

use App\Models\Solicitacao;
use App\Models\Servico;
use Illuminate\Http\Request;

class SolicitacaoController extends Controller
{
    // CREATE
    public function store(Request $request)
    {
        $dados = $request->validate([
            'data_solicitacao' => ['required', 'date'],
            'data_inicio' => ['nullable', 'date'],
            'descricao_problema' => ['required', 'string', 'max:10000'],
            'id_empresa' => ['required', 'integer', 'exists:empresas,id'],
            'categoria_servico' => ['required', 'string', 'max:80'],
        ]);
        $servico = Servico::firstOrCreate(
            ['categoria' => $dados['categoria_servico']],
            [
                'nome' => $dados['categoria_servico'],
                'descricao' => 'Serviço solicitado pelo formulário de abertura de chamado.',
                'ativo' => true,
            ]
        );
        unset($dados['categoria_servico']);
        $solicitacao = Solicitacao::create([
            ...$dados,
            'id_servico' => $servico->id,
            'status' => 'pendente',
            'id_autonomo' => null,
        ]);
        return response()->json([
            'mensagem' => 'Chamado registrado com sucesso.',
            'solicitacao' => $solicitacao,
        ], 201);
    }

    // READ ALL
    public function index()
    {
        return response()->json(Solicitacao::with(['empresa', 'servico'])->latest()->get());
    }

    // READ 
    public function show($id)
    {
        return response()->json(Solicitacao::with(['empresa', 'servico'])->findOrFail($id));
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $solicitacao = Solicitacao::findOrFail($id);
        $dados = $request->validate([
            'data_solicitacao' => ['sometimes', 'required', 'date'],
            'data_inicio' => ['sometimes', 'nullable', 'date'],
            'descricao_problema' => ['sometimes', 'required', 'string', 'max:10000'],
            'status' => ['sometimes', 'required', 'string', 'max:50'],
            'id_empresa' => ['sometimes', 'required', 'integer', 'exists:empresas,id'],
            'id_servico' => ['sometimes', 'required', 'integer', 'exists:servicos,id'],
        ]);
        $solicitacao->update($dados);
        return response()->json($solicitacao->fresh(), 200);
    }

    // DELETE
    public function destroy($id)
    {
        $solicitacao = Solicitacao::findOrFail($id);

        $solicitacao->delete();

        return response()->json([
            'mensagem' => 'Solicitação apagada com sucesso.'
        ], 200);
    }
}
