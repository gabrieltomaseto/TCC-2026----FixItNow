<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('autonomos', function (Blueprint $table) {
            $table->id();
            $table->string('nome', 100);
            $table->string('cpf', 14)->unique();
            $table->string('telefone', 20);
            $table->string('email', 100)->unique();
            $table->string('especialidade', 100);
            $table->string('disponibilidade', 100)->nullable();
            $table->boolean('ativo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('autonomos');
    }
};
