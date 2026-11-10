<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('autonomos', function (Blueprint $table) {
            $table->string('carga_horaria', 100)->nullable()->after('disponibilidade');
        });
    }
    public function down(): void
    {
        Schema::table('autonomos', function (Blueprint $table) {
            $table->dropColumn('carga_horaria');
        });
    }
};
