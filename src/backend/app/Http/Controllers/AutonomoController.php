<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AutonomoController extends Controller
{
    // GET /api/autonomos
    public function index()
    {
        return response()->json([
            ['id' => 1, 'nome' => 'João Silva', 'especialidade' => 'Eletricista'],
            ['id' => 2, 'nome' => 'Maria Oliveira', 'especialidade' => 'Encanadora']
        ], 200);
    }

    // POST /api/autonomos
    public function store(Request $request)
    {
        $dados = $request->all();

        return response()->json([
            'mensagem' => 'Profissional autônomo cadastrado com sucesso!',
            'dados' => $dados
        ], 201);
    }

    // GET /api/autonomos/{id}
    public function show($id)
    {
        return response()->json([
            'mensagem' => 'Buscando autônomo de ID: ' . $id
        ], 200);
    }

    // DELETE /api/autonomos/{id}
    public function destroy($id)
    {
        return response()->json([
            'mensagem' => 'Autônomo de ID ' . $id . ' removido com sucesso!'
        ], 200);
    }
}