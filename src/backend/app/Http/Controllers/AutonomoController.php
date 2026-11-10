<?php

namespace App\Http\Controllers;

use App\Models\Autonomo;
<<<<<<< HEAD
use App\Models\User;
=======
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871
use Illuminate\Http\Request;
use App\Rules\ValidadoresBrasil;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AutonomoController extends Controller
{
<<<<<<< HEAD
    public function store(Request $request)
    {
        if (!$request->user()) abort(401, 'É necessário estar autenticado.');
        if ($request->user()->tipo !== 'autonomo') abort(403, 'Apenas contas autônomas podem cadastrar autônomos.');
        $dados = $request->validate([
            'nome' => ['required', 'string', 'max:100'],
            'cpf' => ['required', 'string', function ($attribute, $value, $fail) { if (!ValidadoresBrasil::cpf((string) $value)) $fail('Informe um CPF válido.'); }, Rule::unique('autonomos', 'cpf')],
            'telefone' => ['required', 'string', 'max:20', function ($attribute, $value, $fail) { if (!ValidadoresBrasil::celular((string) $value)) $fail('Informe um telefone com DDD e 10 ou 11 dígitos.'); }],
            'email' => ['required', 'email', 'max:100', Rule::unique('autonomos', 'email'), Rule::unique('users', 'email')],
            'especialidade' => ['required', 'string', 'max:100'],
            'disponibilidade' => ['sometimes', 'nullable', 'string', 'max:100'],
            'ativo' => ['sometimes', 'boolean'],
            'descricao' => ['sometimes', 'nullable', 'string', 'max:5000'],
        ]);
        $dados['created_by'] = $request->user()->id;
        return response()->json(DB::transaction(fn () => Autonomo::create($dados)), 201);
    }

    public function index() { return response()->json(Autonomo::orderByDesc('id')->get(), 200); }

    public function show($id) { return response()->json(Autonomo::findOrFail($id), 200); }

    public function update(Request $request, $id)
    {
        $autonomo = Autonomo::findOrFail($id);
        $this->assertOwner($request, $autonomo);
        $usuario = User::where('autonomo_id', $autonomo->id)->first();
        $dados = $request->validate([
            'nome' => ['sometimes', 'required', 'string', 'max:100'],
            'cpf' => ['sometimes', 'required', 'string', function ($attribute, $value, $fail) { if (!ValidadoresBrasil::cpf((string) $value)) $fail('Informe um CPF válido.'); }, Rule::unique('autonomos', 'cpf')->ignore($autonomo->id)],
            'telefone' => ['sometimes', 'required', 'string', 'max:20', function ($attribute, $value, $fail) { if (!ValidadoresBrasil::celular((string) $value)) $fail('Informe um telefone com DDD e 10 ou 11 dígitos.'); }],
            'email' => [
                'sometimes', 'required', 'email', 'max:100',
                Rule::unique('autonomos', 'email')->ignore($autonomo->id),
                Rule::unique('users', 'email')->ignore($usuario?->id),
            ],
            'especialidade' => ['sometimes', 'required', 'string', 'max:100'],
            'disponibilidade' => ['sometimes', 'nullable', 'string', 'max:100'],
            'ativo' => ['sometimes', 'boolean'],
            'descricao' => ['sometimes', 'nullable', 'string', 'max:5000'],
        ]);

        DB::transaction(function () use ($autonomo, $usuario, $dados) {
            $autonomo->update($dados);
            if ($usuario) {
                $userData = [];
                if (array_key_exists('nome', $dados)) $userData['name'] = $dados['nome'];
                if (array_key_exists('email', $dados)) $userData['email'] = $dados['email'];
                if ($userData !== []) $usuario->update($userData);
            }
        });
        return response()->json($autonomo->fresh(), 200);
    }

    public function destroy(Request $request, $id)
    {
        $autonomo = Autonomo::findOrFail($id);
        $this->assertOwner($request, $autonomo);
        DB::transaction(function () use ($autonomo) {
            User::where('autonomo_id', $autonomo->id)->get()->each(function (User $usuario) {
                $usuario->tokens()->delete();
                $usuario->delete();
            });
            $autonomo->delete();
        });
        return response()->json(['mensagem' => 'Autônomo apagado com sucesso.'], 200);
    }

    private function assertOwner(Request $request, Autonomo $autonomo): void
    {
        $user = $request->user();
        if (!$user) abort(401, 'É necessário estar autenticado.');
        if (!$autonomo->usuario()->exists() && (int) $autonomo->created_by === (int) $user->id && $user->tipo === 'autonomo') return;
        if ($user->tipo !== 'autonomo' || (int) $user->autonomo_id !== (int) $autonomo->id) {
            abort(403, 'Apenas a conta dona pode alterar este autônomo.');
        }
    }
=======
    // CREATE 
    public function store(Request $request)
    {
        $autonomo = Autonomo::create($request->all());

        return response()->json($autonomo, 201);
    }

    // READ
    public function index()
    {
        $autonomos = Autonomo::all();

        return response()->json($autonomos, 200);
    }

    // READ 
    public function show($id)
    {
        $autonomo = Autonomo::findOrFail($id);

        return response()->json($autonomo, 200);
    }

    // UPDATE 
    public function update(Request $request, $id)
    {
        $autonomo = Autonomo::findOrFail($id);

        $autonomo->update($request->all());

        return response()->json($autonomo, 200);
    }

    // DELETE
    public function destroy($id)
    {
        $autonomo = Autonomo::findOrFail($id);

        $autonomo->delete();

        return response()->json([
            'mensagem' => 'Autônomo apagado com sucesso.'
        ], 200);
    }
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871
}
