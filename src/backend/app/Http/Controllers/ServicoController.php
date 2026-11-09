<?php

namespace App\Http\Controllers;

use App\Models\Servico;
use Illuminate\Http\Request;

class ServicoController extends Controller
{
    public function index()
    {
        return response()->json(
            Servico::orderByDesc('id')->get()
        );
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            'nome' => ['required', 'string', 'max:100'],
            'descricao' => ['nullable', 'string'],
            'categoria' => ['required', 'string', 'max:80'],
            'preco' => ['nullable', 'numeric', 'min:0'],
            'ativo' => ['sometimes', 'boolean'],
        ]);

        $servico = Servico::create($dados);

        return response()->json([
            'mensagem' => 'Serviço criado com sucesso.',
            'servico' => $servico,
        ], 201);
    }

    public function show(string $id)
    {
        $servico = Servico::findOrFail($id);

        return response()->json($servico);
    }

    public function update(Request $request, string $id)
    {
        $servico = Servico::findOrFail($id);

        $dados = $request->validate([
            'nome' => ['sometimes', 'required', 'string', 'max:100'],
            'descricao' => ['sometimes', 'nullable', 'string'],
            'categoria' => ['sometimes', 'required', 'string', 'max:80'],
            'preco' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'ativo' => ['sometimes', 'boolean'],
        ]);

        $servico->update($dados);

        return response()->json([
            'mensagem' => 'Serviço atualizado com sucesso.',
            'servico' => $servico->fresh(),
        ]);
    }

    public function destroy(string $id)
    {
        $servico = Servico::findOrFail($id);

        $servico->delete();

        return response()->json([
            'mensagem' => 'Serviço removido com sucesso.',
        ]);
    }
}
