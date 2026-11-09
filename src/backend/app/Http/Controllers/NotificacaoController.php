<?php

namespace App\Http\Controllers;

use App\Models\Notificacao;
use Illuminate\Http\Request;

class NotificacaoController extends Controller
{
    public function index(Request $request)
    {
        $query = Notificacao::where('user_id', $request->user()->id);
        if ($request->boolean('apenas_nao_lidas')) $query->whereNull('lida_em');

        return response()->json($query->latest('id')->limit(50)->get(), 200);
    }

    public function contagem(Request $request)
    {
        $total = Notificacao::where('user_id', $request->user()->id)->whereNull('lida_em')->count();

        return response()->json(['nao_lidas' => $total], 200);
    }

    public function marcarLida(Request $request, $id)
    {
        $item = Notificacao::where('user_id', $request->user()->id)->whereKey($id)->firstOrFail();
        if (!$item->lida_em) {
            $item->lida_em = now();
            $item->save();
        }

        return response()->json($item->fresh(), 200);
    }

    public function marcarTodasLidas(Request $request)
    {
        $marcadas = Notificacao::where('user_id', $request->user()->id)
            ->whereNull('lida_em')
            ->update(['lida_em' => now()]);

        return response()->json(['mensagem' => 'Notificações marcadas como lidas.', 'marcadas' => $marcadas], 200);
    }
}
