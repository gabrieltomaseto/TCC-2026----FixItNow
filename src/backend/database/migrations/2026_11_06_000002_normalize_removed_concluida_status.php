<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
return new class extends Migration
{
    public function up(): void
    {
        DB::table('solicitacoes')->whereIn('status', ['Concluída', 'concluida', 'Concluído', 'concluido'])->update(['status' => 'Finalizada']);
    }
    public function down(): void
    {
        // O status Concluída foi removido do fluxo e não é restaurado.
    }
};
