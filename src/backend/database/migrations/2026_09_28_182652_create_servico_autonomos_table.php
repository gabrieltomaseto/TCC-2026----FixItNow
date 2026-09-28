<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('servicos_autonomo', function (Blueprint $table) {
            $table->unsignedBigInteger('id_servico');
            $table->unsignedBigInteger('id_autonomo');

            $table->string('status')->default('ativo');
            $table->string('nivel_experiencia')->nullable();

            $table->timestamps();

            $table->primary(['id_servico', 'id_autonomo']);

            $table->foreign('id_servico')
                ->references('id')
                ->on('servicos')
                ->onDelete('cascade');

            $table->foreign('id_autonomo')
                ->references('id')
                ->on('autonomos')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('servicos_autonomo');
    }
};
