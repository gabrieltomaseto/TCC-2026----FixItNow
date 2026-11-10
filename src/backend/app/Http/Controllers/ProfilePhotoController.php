<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfilePhotoController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'foto' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
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

        $novoCaminho = $validated['foto']->storePublicly(
            "profile-photos/{$usuario->id}",
            'public'
        );

        if (!$novoCaminho) {
            return response()->json([
                'mensagem' => 'Não foi possível salvar a foto. Tente novamente.',
            ], 500);
        }

        $caminhoAnterior = $perfil->foto_path;
        $perfil->foto_path = $novoCaminho;
        $perfil->save();
        $perfil->refresh();

        if ($caminhoAnterior && $caminhoAnterior !== $novoCaminho) {
            Storage::disk('public')->delete($caminhoAnterior);
        }

        return response()->json([
            'mensagem' => 'Foto de perfil atualizada com sucesso.',
            'foto_url' => $perfil->foto_url,
        ]);
    }
}
