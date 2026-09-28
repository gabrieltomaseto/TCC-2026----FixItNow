<?php

namespace App\Http\Controllers;

use App\Models\Avaliacao;
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
}
