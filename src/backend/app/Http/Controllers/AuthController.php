<?php

namespace App\Http\Controllers;

use App\Models\Autonomo;
use App\Models\Empresa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function registerEmpresa(Request $request)
    {
        $dados = $request->validate([
            'nome' => ['required', 'string', 'max:100'],
            'cnpj' => ['required', 'string', 'max:18', Rule::unique('empresas', 'cnpj')],
            'endereco' => ['required', 'string', 'max:150'],
            'telefone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:100', Rule::unique('users', 'email'), Rule::unique('empresas', 'email')],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);
        $resultado = DB::transaction(function () use ($dados) {
            $empresa = Empresa::create([
                'nome' => $dados['nome'], 'cnpj' => $dados['cnpj'], 'endereco' => $dados['endereco'],
                'telefone' => $dados['telefone'], 'email' => $dados['email'],
            ]);
            $usuario = User::create([
                'name' => $empresa->nome, 'email' => $dados['email'], 'password' => Hash::make($dados['password']),
                'tipo' => 'empresa', 'empresa_id' => $empresa->id, 'autonomo_id' => null,
            ]);
            return compact('empresa', 'usuario');
        });
        return response()->json([
            'mensagem' => 'Empresa cadastrada com sucesso.', 'empresa' => $resultado['empresa'], 'usuario' => $resultado['usuario'],
            'tipo' => 'empresa', 'token' => $resultado['usuario']->createToken('fixitnow-empresa', ['role:empresa'])->plainTextToken,
            'token_nome' => 'fixitnow-empresa', 'permissoes' => ['role:empresa', 'avaliacoes:criar'],
        ], 201);
    }

    public function registerAutonomo(Request $request)
    {
        $dados = $request->validate([
            'nome' => ['required', 'string', 'max:100'],
            'cpf' => ['required', 'string', 'max:14', Rule::unique('autonomos', 'cpf')],
            'telefone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:100', Rule::unique('users', 'email'), Rule::unique('autonomos', 'email')],
            'especialidade' => ['required', 'string', 'max:100'],
            'disponibilidade' => ['sometimes', 'nullable', 'string', 'max:100'],
            'ativo' => ['sometimes', 'boolean'],
            'descricao' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);
        $resultado = DB::transaction(function () use ($dados) {
            $autonomo = Autonomo::create([
                'nome' => $dados['nome'], 'cpf' => $dados['cpf'], 'telefone' => $dados['telefone'], 'email' => $dados['email'],
                'especialidade' => $dados['especialidade'], 'disponibilidade' => $dados['disponibilidade'] ?? null,
                'ativo' => $dados['ativo'] ?? true, 'descricao' => $dados['descricao'] ?? null,
            ]);
            $usuario = User::create([
                'name' => $autonomo->nome, 'email' => $dados['email'], 'password' => Hash::make($dados['password']),
                'tipo' => 'autonomo', 'empresa_id' => null, 'autonomo_id' => $autonomo->id,
            ]);
            return compact('autonomo', 'usuario');
        });
        return response()->json([
            'mensagem' => 'Autônomo cadastrado com sucesso.', 'autonomo' => $resultado['autonomo'], 'usuario' => $resultado['usuario'],
            'tipo' => 'autonomo', 'token' => $resultado['usuario']->createToken('fixitnow-autonomo', ['role:autonomo'])->plainTextToken,
            'token_nome' => 'fixitnow-autonomo', 'permissoes' => ['role:autonomo', 'pedidos:visualizar'],
        ], 201);
    }

    public function login(Request $request)
    {
        $dados = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'tipo' => ['sometimes', 'nullable', Rule::in(['empresa', 'autonomo'])],
        ]);
        $usuario = User::with(['empresa', 'autonomo'])->where('email', $dados['email'])->first();
        if (!$usuario || !Hash::check($dados['password'], $usuario->password)) {
            return response()->json(['mensagem' => 'E-mail ou senha inválidos.'], 401);
        }
        if (!empty($dados['tipo']) && $dados['tipo'] !== $usuario->tipo) {
            return response()->json(['mensagem' => 'O tipo informado não corresponde a esta conta.'], 409);
        }
        return response()->json([
            'mensagem' => 'Login realizado com sucesso.', 'tipo' => $usuario->tipo, 'usuario' => $usuario,
            'empresa' => $usuario->empresa, 'autonomo' => $usuario->autonomo,
            'token' => $usuario->createToken('fixitnow-' . $usuario->tipo, ['role:' . $usuario->tipo])->plainTextToken,
            'token_nome' => 'fixitnow-' . $usuario->tipo,
            'permissoes' => $usuario->tipo === 'empresa' ? ['role:empresa', 'avaliacoes:criar'] : ['role:autonomo', 'pedidos:visualizar'],
        ], 200);
    }
}
