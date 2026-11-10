<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('swipes_funcionarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empresa_id')->constrained('empresas')->cascadeOnDelete();
            $table->foreignId('autonomo_id')->constrained('autonomos')->cascadeOnDelete();
            $table->string('acao', 20);
            $table->timestamps();
            $table->unique(['empresa_id', 'autonomo_id']);
            $table->index(['empresa_id', 'acao']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('swipes_funcionarios');
    }
};
