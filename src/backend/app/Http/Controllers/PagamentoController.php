<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PagamentoController extends Controller
{
    // GET /api/pagamentos
    public function index()
    {
        return response()->json([
            ['id' => 1, 'solicitacao_id' => 1, 'valor' => 150.00, 'metodo' => 'PIX', 'status' => 'Aprovado']
        ], 200);
    }

    // POST /api/pagamentos
    public function store(Request $request)
    {
        $dados = $request->all();

        return response()->json([
            'mensagem' => 'Pagamento processado com sucesso!',
            'dados' => $dados
        ], 201);
    }

    // GET /api/pagamentos/{id}
    public function show($id)
    {
        return response()->json([
            'mensagem' => 'Buscando comprovante do pagamento ID: ' . $id
        ], 200);
    }

    // DELETE /api/pagamentos/{id}
    public function destroy($id)
    {
        return response()->json([
            'mensagem' => 'Registro de pagamento ID ' . $id . ' removido!'
        ], 200);
    }
}