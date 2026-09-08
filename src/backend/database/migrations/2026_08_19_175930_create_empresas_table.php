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
Schema::create('empresas', function (Blueprint $table) {
    $table->id('id_empresa');
    $table->string('nome', 50);
    $table->string('cnpj', 18);
    $table->string('endereco', 100);
    $table->string('telefone', 20);
    $table->string('email', 100);

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empresas');
    }
};

// 