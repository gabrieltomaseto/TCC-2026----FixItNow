<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            $table->string('foto_path')->nullable()->after('email');
        });

        Schema::table('autonomos', function (Blueprint $table) {
            $table->string('foto_path')->nullable()->after('disponibilidade');
        });
    }

    public function down(): void
    {
        Schema::table('autonomos', function (Blueprint $table) {
            $table->dropColumn('foto_path');
        });

        Schema::table('empresas', function (Blueprint $table) {
            $table->dropColumn('foto_path');
        });
    }
};
