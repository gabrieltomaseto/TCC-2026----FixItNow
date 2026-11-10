<?php

namespace App\Http\Controllers;

use App\Models\ServicoAutonomo;
<<<<<<< HEAD
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
=======
use Illuminate\Http\Request;
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871

class ServicoAutonomoController extends Controller
{
    public function index()
    {
<<<<<<< HEAD
        return response()->json(ServicoAutonomo::with(['servico', 'autonomo'])->get(), 200);
=======
        return response()->json(
            ServicoAutonomo::all(),
            200
        );
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871
    }

    public function store(Request $request)
    {
<<<<<<< HEAD
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
=======
        $servicoAutonomo = ServicoAutonomo::create(
            $request->only([
                'id_servico',
                'id_autonomo',
                'status',
                'nivel_experiencia',
            ])
        );

        return response()->json($servicoAutonomo, 201);
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871
    }

    public function show($id_servico, $id_autonomo)
    {
<<<<<<< HEAD
        $item = ServicoAutonomo::with(['servico', 'autonomo'])->where('id_servico', $id_servico)->where('id_autonomo', $id_autonomo)->firstOrFail();
        return response()->json($item, 200);
=======
        $servicoAutonomo = ServicoAutonomo::where('id_servico', $id_servico)
            ->where('id_autonomo', $id_autonomo)
            ->firstOrFail();

        return response()->json($servicoAutonomo, 200);
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871
    }

    public function update(Request $request, $id_servico, $id_autonomo)
    {
<<<<<<< HEAD
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
=======
        $dados = $request->only([
            'status',
            'nivel_experiencia',
        ]);

        $quantidade = ServicoAutonomo::where('id_servico', $id_servico)
            ->where('id_autonomo', $id_autonomo)
            ->update($dados);

        if ($quantidade === 0) {
            return response()->json([
                'mensagem' => 'Relação não encontrada.'
            ], 404);
        }

        $servicoAutonomo = ServicoAutonomo::where('id_servico', $id_servico)
            ->where('id_autonomo', $id_autonomo)
            ->first();

        return response()->json($servicoAutonomo, 200);
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871
    }

    public function destroy($id_servico, $id_autonomo)
    {
<<<<<<< HEAD
        $deleted = ServicoAutonomo::where('id_servico', $id_servico)
            ->where('id_autonomo', $id_autonomo)
            ->delete();
        if ($deleted === 0) abort(404);
        return response()->json(['mensagem' => 'Serviço do autônomo apagado com sucesso.'], 200);
=======
        $quantidade = ServicoAutonomo::where('id_servico', $id_servico)
            ->where('id_autonomo', $id_autonomo)
            ->delete();

        if ($quantidade === 0) {
            return response()->json([
                'mensagem' => 'Relação não encontrada.'
            ], 404);
        }

        return response()->json([
            'mensagem' => 'Serviço do autônomo apagado com sucesso.'
        ], 200);
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871
    }
}
