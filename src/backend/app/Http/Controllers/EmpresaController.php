<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EmpresaController extends Controller
{
    // GET /api/empresas
    public function index()
    {
        // Retorna a listagem simulada envelopada em JSON
        return response()->json([
            ['id' => 1, 'nome' => 'Empresa A', 'servico' => 'Manutenção']
        ], 200);
    }

    // POST /api/empresas
    public function store(Request $request)
    {
        // Captura o payload JSON enviado pelo cliente
        $dados = $request->all();

        return response()->json([
            'mensagem' => 'Empresa cadastrada com sucesso!',
            'dados' => $dados
        ], 201); // Status Code 201 Created
    }

    // GET /api/empresas/{id}
    public function show($id)
    {
        return response()->json([
            'mensagem' => 'Buscando empresa de ID: ' . $id
        ], 200);
    }

    // DELETE /api/empresas/{id}
    public function destroy($id)
    {
        return response()->json([
            'mensagem' => 'Empresa ' . $id . ' removida com sucesso!'
        ], 200);
    }
}