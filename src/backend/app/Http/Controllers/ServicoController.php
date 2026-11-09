<?php

namespace App\Http\Controllers;

use App\Models\Servico;
use Illuminate\Http\Request;

class ServicoController extends Controller
{
    public function index() { return response()->json(Servico::orderByDesc('id')->get(), 200); }

    public function store(Request $request)
    {
        $servico = Servico::create($request->validate($this->rules()));
        return response()->json(['mensagem' => 'Serviço criado com sucesso.', 'servico' => $servico], 201);
    }

    public function show(string $id) { return response()->json(Servico::findOrFail($id), 200); }

    public function update(Request $request, string $id)
    {
        $servico = Servico::findOrFail($id);
        $servico->update($request->validate($this->updateRules()));
        return response()->json(['mensagem' => 'Serviço atualizado com sucesso.', 'servico' => $servico->fresh()], 200);
    }

    public function destroy(string $id)
    {
        Servico::findOrFail($id)->delete();
        return response()->json(['mensagem' => 'Serviço removido com sucesso.'], 200);
    }

    private function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:100'],
            'descricao' => ['nullable', 'string'],
            'categoria' => ['required', 'string', 'max:80'],
            'preco' => ['nullable', 'numeric', 'decimal:0,2', 'between:0,99999999.99'],
            'ativo' => ['sometimes', 'boolean'],
        ];
    }

    private function updateRules(): array
    {
        return [
            'nome' => ['sometimes', 'required', 'string', 'max:100'],
            'descricao' => ['sometimes', 'nullable', 'string'],
            'categoria' => ['sometimes', 'required', 'string', 'max:80'],
            'preco' => ['sometimes', 'nullable', 'numeric', 'decimal:0,2', 'between:0,99999999.99'],
            'ativo' => ['sometimes', 'boolean'],
        ];
    }
}
