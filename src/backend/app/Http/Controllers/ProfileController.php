<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $usuario = $request->user()->load(['empresa', 'autonomo']);
        $perfil = match ($usuario->tipo) {
            'empresa' => $usuario->empresa,
            'autonomo' => $usuario->autonomo,
            default => null,
        };

        if (!$perfil) {
            return response()->json(['mensagem' => 'Não foi possível localizar o perfil desta conta.'], 404);
        }

        return response()->json(['perfil' => $perfil, 'usuario' => $usuario, 'tipo' => $usuario->tipo]);
    }

    public function update(Request $request)
    {
        $dados = $request->validate([
            'descricao' => ['present', 'nullable', 'string', 'max:5000'],
        ]);

        $usuario = $request->user()->load(['empresa', 'autonomo']);
        $perfil = match ($usuario->tipo) {
            'empresa' => $usuario->empresa,
            'autonomo' => $usuario->autonomo,
            default => null,
        };

        if (!$perfil) {
            return response()->json([
                'mensagem' => 'Não foi possível localizar o perfil desta conta.',
            ], 404);
        }

        $perfil->descricao = $dados['descricao'] ?? null;
        $perfil->save();

        return response()->json([
            'mensagem' => 'Descrição do perfil atualizada com sucesso.',
            'perfil' => $perfil->refresh(),
        ], 200);
    }
}
