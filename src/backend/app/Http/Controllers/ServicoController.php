<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ServicoController extends Controller
{
    // GET
    public function index()
    {
        return response()->json([
            ['id' => 1, 'titulo' => 'Troca de Fiação', 'categoria' => 'Elétrica'],
            ['id' => 2, 'titulo' => 'Reparo de Vazamento', 'categoria' => 'Hidráulica']
        ], 200);
    }

    // POST
    public function store(Request $request)
    {
        $dados = $request->all();

        return response()->json([
            'mensagem' => 'Serviço cadastrado com sucesso!',
            'dados' => $dados
        ], 201);
    }

    // GET
    public function show($id)
    {
        return response()->json([
            'mensagem' => 'Buscando serviço de ID: ' . $id
        ], 200);
    }

    // DELETE
    public function destroy($id)
    {
        return response()->json([
            'mensagem' => 'Serviço de ID ' . $id . ' removido com sucesso!'
        ], 200);
    }
}