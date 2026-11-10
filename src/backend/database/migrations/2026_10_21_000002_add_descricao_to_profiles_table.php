<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            $table->text('descricao')->nullable();
        });

        Schema::table('autonomos', function (Blueprint $table) {
            $table->text('descricao')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('autonomos', function (Blueprint $table) {
            $table->dropColumn('descricao');
        });

        Schema::table('empresas', function (Blueprint $table) {
            $table->dropColumn('descricao');
        });
    }
};
