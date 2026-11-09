<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('solicitacoes', function (Blueprint $table) {
            $table->text('resposta_autonomo')->nullable();
            $table->timestamp('respondida_em')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('solicitacoes', function (Blueprint $table) {
            $table->dropColumn(['resposta_autonomo', 'respondida_em']);
        });
    }
};
