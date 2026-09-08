<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
class AvaliacaoController extends Controller
{
    // GET /api/avaliacoes
    public function index()
    {
        return response()->json([
            ['id' => 1, 'nota' => 5, 'comentario' => 'Ótimo atendimento, recomendo!', 'prestador_id' => 1]
        ], 200);
    }

    // POST /api/avaliacoes
    public function store(Request $request)
    {
        $dados = $request->all();

        return response()->json([
            'mensagem' => 'Avaliação enviada com sucesso!',
            'dados' => $dados
        ], 201);
    }

    // GET /api/avaliacoes/{id}
    public function show($id)
    {
        return response()->json([
            'mensagem' => 'Buscando avaliação de ID: ' . $id
        ], 200);
    }

    // DELETE /api/avaliacoes/{id}
    public function destroy($id)
    {
        return response()->json([
            'mensagem' => 'Avaliação ID ' . $id . ' removida!'
        ], 200);
    }
}