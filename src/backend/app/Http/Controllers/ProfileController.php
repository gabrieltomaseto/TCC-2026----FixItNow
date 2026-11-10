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
        $usuario = $request->user()->load(['empresa', 'autonomo']);
        $dados = $request->validate([
            'descricao' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'nome' => ['sometimes', 'required', 'string', 'max:100'],
            'carga_horaria' => ['sometimes', 'nullable', 'string', 'max:100'],
            'disponibilidade' => ['sometimes', 'nullable', 'string', 'max:100'],
        ]);

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

        if (array_key_exists('nome', $dados)) {
            $perfil->nome = $dados['nome'];
            $usuario->name = $dados['nome'];
            $usuario->save();
        }
        if (array_key_exists('descricao', $dados)) {
            $perfil->descricao = $dados['descricao'];
        }
        if ($usuario->tipo === 'autonomo' && array_key_exists('carga_horaria', $dados)) {
            $perfil->carga_horaria = $dados['carga_horaria'];
        }
        if ($usuario->tipo === 'autonomo' && array_key_exists('disponibilidade', $dados)) {
            $perfil->disponibilidade = $dados['disponibilidade'];
        }
        $perfil->save();

        return response()->json([
            'mensagem' => 'Perfil atualizado com sucesso.',
            'perfil' => $perfil->refresh(),
            'usuario' => $usuario->refresh(),
        ], 200);
    }
}
