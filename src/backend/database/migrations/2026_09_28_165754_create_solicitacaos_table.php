<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solicitacoes', function (Blueprint $table) {
            $table->id();

            $table->date('data_solicitacao');
            $table->text('descricao_problema');
            $table->string('status')->default('pendente');

            $table->foreignId('id_empresa')
                ->constrained('empresas')
                ->onDelete('cascade');

            $table->foreignId('id_servico')
                ->constrained('servicos')
                ->onDelete('cascade');

            $table->foreignId('id_autonomo')
                ->nullable()
                ->constrained('autonomos')
                ->onDelete('set null');

            $table->date('data_inicio')->nullable();
            $table->date('data_fim')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solicitacoes');
    }
};
