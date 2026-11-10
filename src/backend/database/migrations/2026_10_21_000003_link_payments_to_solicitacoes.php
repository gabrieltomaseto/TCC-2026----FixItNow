<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pagamentos', function (Blueprint $table) {
            $table->foreignId('id_solicitacao')
                ->nullable()
                ->after('id')
                ->constrained('solicitacoes')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('pagamentos', function (Blueprint $table) {
            $table->dropConstrainedForeignId('id_solicitacao');
        });
    }
};
