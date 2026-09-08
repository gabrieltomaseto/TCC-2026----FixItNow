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
Schema::create('servico_autonomo', function (Blueprint $table) {
    $table->unsignedBigInteger('id_autonomo');
    $table->unsignedBigInteger('id_servico');
    $table->string('status', 50);
    $table->string('nivel_experiencia', 50);
    $table->primary(['id_autonomo', 'id_servico']);
    $table->foreign('id_autonomo')->references('id_autonomo')->on('autonomo');
    $table->foreign('id_servico')->references('id_SERVICO')->on('sevicos');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sevicos_autonomo');
    }
};

// 