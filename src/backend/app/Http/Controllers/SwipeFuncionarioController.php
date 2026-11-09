<?php
namespace App\Http\Controllers;
use App\Models\Autonomo;
use App\Models\SwipeFuncionario;
use Illuminate\Http\Request;
class SwipeFuncionarioController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->tipo !== 'empresa' || !$user->empresa_id) {
            return response()->json(['mensagem' => 'Apenas empresas podem usar o swipe de funcionários.'], 403);
        }
        $jaAvaliados = SwipeFuncionario::where('empresa_id', $user->empresa_id)->pluck('autonomo_id');
        $autonomos = Autonomo::query()
            ->where('ativo', true)
            ->whereNotIn('id', $jaAvaliados)
            ->orderBy('id')
            ->get();
        return response()->json($autonomos, 200);
    }
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->tipo !== 'empresa' || !$user->empresa_id) {
            return response()->json(['mensagem' => 'Apenas empresas podem registrar decisões de swipe.'], 403);
        }
        $dados = $request->validate([
            'autonomo_id' => ['required', 'integer', 'exists:autonomos,id'],
            'acao' => ['required', 'string', 'in:like,dislike'],
        ]);
        $autonomo = Autonomo::where('ativo', true)->findOrFail($dados['autonomo_id']);
        $swipe = SwipeFuncionario::updateOrCreate(
            ['empresa_id' => $user->empresa_id, 'autonomo_id' => $autonomo->id],
            ['acao' => $dados['acao']]
        );
        return response()->json([
            'mensagem' => $dados['acao'] === 'like' ? 'Funcionário selecionado.' : 'Funcionário dispensado.',
            'swipe' => $swipe->load('autonomo'),
        ], 201);
    }
}
