<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('solicitacoes', function (Blueprint $table) {
            $table->string('nome_contato', 100)->nullable();
            $table->string('empresa_contato', 100)->nullable();
            $table->string('local_atendimento', 150)->nullable();
            $table->string('telefone_contato', 20)->nullable();
            $table->string('tipo_servico', 100)->nullable();
            $table->string('prioridade', 20)->nullable();
            $table->decimal('preco_estimado', 10, 2)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('solicitacoes', function (Blueprint $table) {
            $table->dropColumn([
                'nome_contato',
                'empresa_contato',
                'local_atendimento',
                'telefone_contato',
                'tipo_servico',
                'prioridade',
                'preco_estimado',
            ]);
        });
    }
};
