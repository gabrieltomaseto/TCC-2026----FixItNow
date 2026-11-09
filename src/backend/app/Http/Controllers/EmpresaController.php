<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class EmpresaController extends Controller
{
    public function store(Request $request)
    {
        if (!$request->user()) abort(401, 'É necessário estar autenticado.');
        if ($request->user()->tipo !== 'empresa') abort(403, 'Apenas contas empresariais podem cadastrar empresas.');
        $dados = $request->validate([
            'nome' => ['required', 'string', 'max:100'],
            'cnpj' => ['required', 'string', 'max:18', Rule::unique('empresas', 'cnpj')],
            'endereco' => ['required', 'string', 'max:150'],
            'telefone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:100', Rule::unique('empresas', 'email'), Rule::unique('users', 'email')],
            'descricao' => ['sometimes', 'nullable', 'string', 'max:5000'],
        ]);
        $dados['created_by'] = $request->user()->id;
        return response()->json(DB::transaction(fn () => Empresa::create($dados)), 201);
    }

    public function index() { return response()->json(Empresa::orderByDesc('id')->get(), 200); }

    public function show($id) { return response()->json(Empresa::findOrFail($id), 200); }

    public function update(Request $request, $id)
    {
        $empresa = Empresa::findOrFail($id);
        $this->assertOwner($request, $empresa);
        $usuario = User::where('empresa_id', $empresa->id)->first();
        $dados = $request->validate([
            'nome' => ['sometimes', 'required', 'string', 'max:100'],
            'cnpj' => ['sometimes', 'required', 'string', 'max:18', Rule::unique('empresas', 'cnpj')->ignore($empresa->id)],
            'endereco' => ['sometimes', 'required', 'string', 'max:150'],
            'telefone' => ['sometimes', 'required', 'string', 'max:20'],
            'email' => [
                'sometimes', 'required', 'email', 'max:100',
                Rule::unique('empresas', 'email')->ignore($empresa->id),
                Rule::unique('users', 'email')->ignore($usuario?->id),
            ],
            'descricao' => ['sometimes', 'nullable', 'string', 'max:5000'],
        ]);

        DB::transaction(function () use ($empresa, $usuario, $dados) {
            $empresa->update($dados);
            if ($usuario) {
                $userData = [];
                if (array_key_exists('nome', $dados)) $userData['name'] = $dados['nome'];
                if (array_key_exists('email', $dados)) $userData['email'] = $dados['email'];
                if ($userData !== []) $usuario->update($userData);
            }
        });
        return response()->json($empresa->fresh(), 200);
    }

    public function destroy(Request $request, $id)
    {
        $empresa = Empresa::findOrFail($id);
        $this->assertOwner($request, $empresa);
        DB::transaction(function () use ($empresa) {
            User::where('empresa_id', $empresa->id)->get()->each(function (User $usuario) {
                $usuario->tokens()->delete();
                $usuario->delete();
            });
            $empresa->delete();
        });
        return response()->json(['mensagem' => 'Empresa apagada com sucesso.'], 200);
    }

    private function assertOwner(Request $request, Empresa $empresa): void
    {
        $user = $request->user();
        if (!$user) abort(401, 'É necessário estar autenticado.');
        if (!$empresa->usuario()->exists() && (int) $empresa->created_by === (int) $user->id && $user->tipo === 'empresa') return;
        if ($user->tipo !== 'empresa' || (int) $user->empresa_id !== (int) $empresa->id) {
            abort(403, 'Apenas a conta dona pode alterar esta empresa.');
        }
    }
}
