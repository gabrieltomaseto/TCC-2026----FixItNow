<?php

namespace App\Http\Controllers;

use App\Models\ServicoAutonomo;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServicoAutonomoController extends Controller
{
    public function index()
    {
        return response()->json(ServicoAutonomo::with(['servico', 'autonomo'])->get(), 200);
    }

    public function store(Request $request)
    {
        $dados = Validator::make($request->all(), [
            'id_servico' => ['required', 'integer', 'exists:servicos,id'],
            'id_autonomo' => ['required', 'integer', 'exists:autonomos,id'],
            'status' => ['sometimes', 'string', 'max:255'],
            'nivel_experiencia' => ['sometimes', 'nullable', 'string', 'max:255'],
        ])->validate();
        if (ServicoAutonomo::where('id_servico', $dados['id_servico'])->where('id_autonomo', $dados['id_autonomo'])->exists()) {
            return response()->json(['mensagem' => 'Esta relação serviço-autônomo já existe.'], 409);
        }
        $dados['status'] = $dados['status'] ?? 'ativo';
        try {
            $item = ServicoAutonomo::create($dados);
        } catch (QueryException $exception) {
            $message = strtolower($exception->getMessage());
            if (str_contains($message, 'unique') || str_contains($message, 'duplicate')) {
                return response()->json(['mensagem' => 'Esta relação serviço-autônomo já existe.'], 409);
            }
            throw $exception;
        }
        return response()->json($item->load(['servico', 'autonomo']), 201);
    }

    public function show($id_servico, $id_autonomo)
    {
        $item = ServicoAutonomo::with(['servico', 'autonomo'])->where('id_servico', $id_servico)->where('id_autonomo', $id_autonomo)->firstOrFail();
        return response()->json($item, 200);
    }

    public function update(Request $request, $id_servico, $id_autonomo)
    {
        $dados = Validator::make($request->all(), [
            'status' => ['sometimes', 'string', 'max:255'],
            'nivel_experiencia' => ['sometimes', 'nullable', 'string', 'max:255'],
        ])->validate();
        // Busca antes do update para que rowCount=0 por no-op continue sendo 200.
        $item = ServicoAutonomo::where('id_servico', $id_servico)->where('id_autonomo', $id_autonomo)->firstOrFail();
        if ($dados !== []) {
            // Eloquent não suporta chave primária composta em Model::update().
            ServicoAutonomo::where('id_servico', $id_servico)
                ->where('id_autonomo', $id_autonomo)
                ->update($dados);
        }
        $item = ServicoAutonomo::with(['servico', 'autonomo'])
            ->where('id_servico', $id_servico)
            ->where('id_autonomo', $id_autonomo)
            ->firstOrFail();
        return response()->json($item, 200);
    }

    public function destroy($id_servico, $id_autonomo)
    {
        $deleted = ServicoAutonomo::where('id_servico', $id_servico)
            ->where('id_autonomo', $id_autonomo)
            ->delete();
        if ($deleted === 0) abort(404);
        return response()->json(['mensagem' => 'Serviço do autônomo apagado com sucesso.'], 200);
    }
}
