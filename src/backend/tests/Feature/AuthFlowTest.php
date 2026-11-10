<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_autonomo_can_register_and_log_in(): void
    {
        $this->postJson('/api/auth/autonomo/cadastro', [
            'nome' => 'Ana Autonoma',
            'cpf' => '12345678900',
            'telefone' => '11999990000',
            'especialidade' => 'Eletricista',
            'disponibilidade' => 'Segunda a sexta',
            'email' => 'ana@example.com',
            'password' => 'senha123',
            'password_confirmation' => 'senha123',
        ])
            ->assertCreated()
            ->assertJsonPath('tipo', 'autonomo');

        $this->assertDatabaseHas('users', [
            'email' => 'ana@example.com',
            'tipo' => 'autonomo',
        ]);

        $this->postJson('/api/auth/login', [
            'email' => 'ana@example.com',
            'password' => 'senha123',
        ])
            ->assertOk()
            ->assertJsonPath('tipo', 'autonomo')
            ->assertJsonStructure(['token']);
    }

    public function test_empresa_can_register_and_log_in(): void
    {
        $this->postJson('/api/auth/empresa/cadastro', [
            'nome' => 'Empresa de Teste',
            'cnpj' => '12345678000199',
            'endereco' => 'Rua de Teste, 123',
            'telefone' => '1133334444',
            'email' => 'empresa@example.com',
            'password' => 'senha123',
            'password_confirmation' => 'senha123',
        ])
            ->assertCreated()
            ->assertJsonPath('tipo', 'empresa');

        $this->assertDatabaseHas('users', [
            'email' => 'empresa@example.com',
            'tipo' => 'empresa',
        ]);

        $this->postJson('/api/auth/login', [
            'email' => 'empresa@example.com',
            'password' => 'senha123',
        ])
            ->assertOk()
            ->assertJsonPath('tipo', 'empresa')
            ->assertJsonStructure(['token']);
    }

    public function test_login_rejects_an_invalid_password(): void
    {
        $this->postJson('/api/auth/autonomo/cadastro', [
            'nome' => 'Ana Autonoma',
            'cpf' => '12345678900',
            'telefone' => '11999990000',
            'especialidade' => 'Eletricista',
            'email' => 'ana@example.com',
            'password' => 'senha123',
            'password_confirmation' => 'senha123',
        ])->assertCreated();

        $this->postJson('/api/auth/login', [
            'email' => 'ana@example.com',
            'password' => 'senha-errada',
        ])
            ->assertUnauthorized()
            ->assertJsonPath('mensagem', 'E-mail ou senha inválidos.');
    }

    public function test_documents_require_only_their_structural_digit_count(): void
    {
        $this->postJson('/api/auth/autonomo/cadastro', [
            'nome' => 'Profissional Teste', 'cpf' => '1234567890', 'telefone' => '11999990000',
            'especialidade' => 'Elétrica', 'email' => 'cpf-invalido@example.test',
            'password' => 'password', 'password_confirmation' => 'password',
        ])->assertUnprocessable();

        $this->postJson('/api/auth/empresa/cadastro', [
            'nome' => 'Empresa Teste', 'cnpj' => '1234567890123', 'endereco' => 'Rua A',
            'telefone' => '11999990000', 'email' => 'cnpj-invalido@example.test',
            'password' => 'password', 'password_confirmation' => 'password',
        ])->assertUnprocessable();

        // O formato correto passa mesmo sem validar os dígitos verificadores.
        $this->postJson('/api/auth/autonomo/cadastro', [
            'nome' => 'Profissional Estrutural', 'cpf' => '00000000000', 'telefone' => '11999990000',
            'especialidade' => 'Elétrica', 'email' => 'cpf-valido@example.test',
            'password' => 'password', 'password_confirmation' => 'password',
        ])->assertCreated();
    }
}
