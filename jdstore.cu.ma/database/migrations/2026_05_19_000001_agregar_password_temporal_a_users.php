<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('password_temporal')->default(false)->after('password');
            $table->timestamp('password_temporal_creado_en')->nullable()->after('password_temporal');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['password_temporal', 'password_temporal_creado_en']);
        });
    }
};

