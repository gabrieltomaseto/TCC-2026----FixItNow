<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
return new class extends Migration
{
    public function up(): void
    {
        $servicos = [
            ['nome' => 'Elétrica', 'categoria' => 'Elétrica', 'descricao' => 'Instalações, reparos e manutenção elétrica.'],
            ['nome' => 'Hidráulica', 'categoria' => 'Hidráulica', 'descricao' => 'Reparos em tubulações, torneiras e vazamentos.'],
            ['nome' => 'Ar-condicionado', 'categoria' => 'Climatização', 'descricao' => 'Instalação, limpeza e manutenção de ar-condicionado.'],
            ['nome' => 'Manutenção predial', 'categoria' => 'Manutenção', 'descricao' => 'Manutenções gerais em ambientes prediais.'],
            ['nome' => 'Pintura', 'categoria' => 'Pintura', 'descricao' => 'Pintura e acabamento de ambientes.'],
            ['nome' => 'Refrigeração', 'categoria' => 'Refrigeração', 'descricao' => 'Manutenção de equipamentos de refrigeração.'],
            ['nome' => 'Informática / redes', 'categoria' => 'Informática', 'descricao' => 'Suporte técnico, computadores e redes.'],
            ['nome' => 'Outros', 'categoria' => 'Outros', 'descricao' => 'Serviços gerais sob consulta.'],
        ];
        foreach ($servicos as $servico) {
            if (!DB::table('servicos')->where('nome', $servico['nome'])->exists()) {
                DB::table('servicos')->insert($servico + [
                    'preco' => null,
                    'ativo' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
    public function down(): void
    {
        // Os serviços podem ter sido usados por solicitações; não removê-los automaticamente.
    }
};
