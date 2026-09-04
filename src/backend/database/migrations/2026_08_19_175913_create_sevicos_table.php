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
Schema::create('sevicos', function (Blueprint $table) {
    $table->id('id_SERVICO');
    $table->string('nome_servico', 50);
    $table->string('descricao', 50);
    $table->string('categoria', 50);
    $table->unsignedBigInteger('id_solicitacao')->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sevicos');
    }
};

// 