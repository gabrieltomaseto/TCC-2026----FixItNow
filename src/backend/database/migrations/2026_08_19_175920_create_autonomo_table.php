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
Schema::create('autonomo', function (Blueprint $table) {
    $table->id('id_autonomo');
    $table->string('nome', 50);
    $table->string('cpf', 14);
    $table->string('telefone', 20);
    $table->string('email', 100);
    $table->string('especialidade', 50);
    $table->string('disponibilidade', 50);

    $table->timestamps();
});
    }
    public function down(): void
    {
        Schema::dropIfExists('autonomo');
    }
};

// 