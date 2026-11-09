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
    /*
    Cadastro de empresa
    */
    public function registerEmpresa(Request $request)
    {
        $dados = $request->validate([
            'nome' => ['required', 'string', 'max:100'],
            'cnpj' => ['required', 'string', 'max:18', 'unique:empresas,cnpj'],
            'endereco' => ['required', 'string', 'max:150'],
            'telefone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:100', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $resultado = DB::transaction(function () use ($dados) {
            $empresa = Empresa::create([
                'nome' => $dados['nome'],
                'cnpj' => $dados['cnpj'],
                'endereco' => $dados['endereco'],
                'telefone' => $dados['telefone'],
                'email' => $dados['email'],
            ]);

            $usuario = User::create([
                'name' => $empresa->nome,
                'email' => $dados['email'],
                'password' => Hash::make($dados['password']),
                'tipo' => 'empresa',
                'empresa_id' => $empresa->id,
                'autonomo_id' => null,
            ]);

            return [
                'empresa' => $empresa,
                'usuario' => $usuario,
            ];
        });

        return response()->json([
            'mensagem' => 'Empresa cadastrada com sucesso.',
            'empresa' => $resultado['empresa'],
            'usuario' => $resultado['usuario'],
        ], 201);
    }

    /*
    Cadastro de autônomo
    */
    public function registerAutonomo(Request $request)
    {
        $dados = $request->validate([
            'nome' => ['required', 'string', 'max:100'],
            'cpf' => ['required', 'string', 'max:14', 'unique:autonomos,cpf'],
            'telefone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:100', 'unique:users,email'],
            'especialidade' => ['required', 'string', 'max:100'],
            'disponibilidade' => ['nullable', 'string', 'max:100'],
            'ativo' => ['sometimes', 'boolean'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $resultado = DB::transaction(function () use ($dados) {
            $autonomo = Autonomo::create([
                'nome' => $dados['nome'],
                'cpf' => $dados['cpf'],
                'telefone' => $dados['telefone'],
                'email' => $dados['email'],
                'especialidade' => $dados['especialidade'],
                'disponibilidade' => $dados['disponibilidade'] ?? null,
                'ativo' => $dados['ativo'] ?? true,
            ]);

            $usuario = User::create([
                'name' => $autonomo->nome,
                'email' => $dados['email'],
                'password' => Hash::make($dados['password']),
                'tipo' => 'autonomo',
                'empresa_id' => null,
                'autonomo_id' => $autonomo->id,
            ]);

            return [
                'autonomo' => $autonomo,
                'usuario' => $usuario,
            ];
        });

        return response()->json([
            'mensagem' => 'Autônomo cadastrado com sucesso.',
            'autonomo' => $resultado['autonomo'],
            'usuario' => $resultado['usuario'],
        ], 201);
    }

    /*
    Login de empresa ou autônomo
    */
    public function login(Request $request)
    {
        $dados = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $usuario = User::with(['empresa', 'autonomo'])
            ->where('email', $dados['email'])
            ->first();

        if (!$usuario || !Hash::check($dados['password'], $usuario->password)) {
            return response()->json([
                'mensagem' => 'E-mail ou senha inválidos.',
            ], 401);
        }

        return response()->json([
            'mensagem' => 'Login realizado com sucesso.',
            'tipo' => $usuario->tipo,
            'usuario' => $usuario,
            'empresa' => $usuario->empresa,
            'autonomo' => $usuario->autonomo,
        ], 200);
    }
}
