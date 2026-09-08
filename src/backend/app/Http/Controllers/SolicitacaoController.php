<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SolicitacaoController extends Controller
{
    // GET
    public function index()
    {
        return response()->json([
            ['id' => 1, 'cliente' => 'Carlos Lima', 'servico_id' => 1, 'status' => 'Pendente'],
            ['id' => 2, 'cliente' => 'Ana Costa', 'servico_id' => 2, 'status' => 'Em Andamento']
        ], 200);
    }

    // POST 
    public function store(Request $request)
    {
        $dados = $request->all();

        return response()->json([
            'mensagem' => 'Solicitação de serviço criada com sucesso!',
            'dados' => $dados
        ], 201);
    }

    // GET
    public function show($id)
    {
        return response()->json([
            'mensagem' => 'Buscando solicitação de ID: ' . $id
        ], 200);
    }

    // DELETE
    public function destroy($id)
    {
        return response()->json([
            'mensagem' => 'Solicitação de ID ' . $id . ' cancelada/removida com sucesso!'
        ], 200);
    }
}