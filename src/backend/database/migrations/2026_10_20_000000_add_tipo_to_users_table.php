<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('tipo')->nullable()->after('autonomo_id');
        });

        DB::table('users')
            ->whereNotNull('empresa_id')
            ->whereNull('tipo')
            ->update(['tipo' => 'empresa']);

        DB::table('users')
            ->whereNotNull('autonomo_id')
            ->whereNull('tipo')
            ->update(['tipo' => 'autonomo']);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('tipo');
        });
    }
};
