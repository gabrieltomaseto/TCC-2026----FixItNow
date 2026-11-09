<?php

namespace App\Http\Controllers;

use App\Models\ServicoAutonomo;
use Illuminate\Http\Request;

class ServicoAutonomoController extends Controller
{
    public function index()
    {
        return response()->json(
            ServicoAutonomo::all(),
            200
        );
    }

    public function store(Request $request)
    {
        $servicoAutonomo = ServicoAutonomo::create(
            $request->only([
                'id_servico',
                'id_autonomo',
                'status',
                'nivel_experiencia',
            ])
        );

        return response()->json($servicoAutonomo, 201);
    }

    public function show($id_servico, $id_autonomo)
    {
        $servicoAutonomo = ServicoAutonomo::where('id_servico', $id_servico)
            ->where('id_autonomo', $id_autonomo)
            ->firstOrFail();

        return response()->json($servicoAutonomo, 200);
    }

    public function update(Request $request, $id_servico, $id_autonomo)
    {
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
    }

    public function destroy($id_servico, $id_autonomo)
    {
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
    }
}
