<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
Schema::create('solicitacao', function (Blueprint $table) {
    $table->id('id_solicitacao');
    $table->date('data_solicitacao');
    $table->string('descricao_problema', 50);
    $table->string('status', 50);
    $table->unsignedBigInteger('id_empresa');
    $table->unsignedBigInteger('id_servico');
    $table->unsignedBigInteger('id_pagamento')->nullable();
    $table->date('data_inicio')->nullable();
    $table->date('data_fim')->nullable();
    $table->unsignedBigInteger('id_autonomo')->nullable();
    $table->unsignedBigInteger('id_avaliacao')->nullable();
    $table->timestamps();

    $table->foreign('id_empresa') ->references('id_empresa')->on('empresas');$table->foreign('id_servico')->references('id_SERVICO')->on('sevicos');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitacao');
    }
};

// 