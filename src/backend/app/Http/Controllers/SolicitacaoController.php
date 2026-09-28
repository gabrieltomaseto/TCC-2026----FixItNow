<?php

namespace App\Http\Controllers;

use App\Models\Solicitacao;
use Illuminate\Http\Request;

class SolicitacaoController extends Controller
{
    // CREATE
    public function store(Request $request)
    {
        $solicitacao = Solicitacao::create($request->all());

        return response()->json($solicitacao, 201);
    }

    // READ ALL
    public function index()
    {
        $solicitacoes = Solicitacao::all();

        return response()->json($solicitacoes, 200);
    }

    // READ 
    public function show($id)
    {
        $solicitacao = Solicitacao::findOrFail($id);

        return response()->json($solicitacao, 200);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $solicitacao = Solicitacao::findOrFail($id);

        $solicitacao->update($request->all());

        return response()->json($solicitacao, 200);
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
