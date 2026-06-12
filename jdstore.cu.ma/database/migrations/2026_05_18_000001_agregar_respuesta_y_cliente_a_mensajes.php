<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mensajes', function (Blueprint $table) {
            $table->unsignedBigInteger('cliente_id')->nullable()->index()->after('id');
            $table->boolean('leido_cliente')->default(false)->after('leido');
            $table->text('respuesta')->nullable()->after('mensaje');
            $table->timestamp('respondido_en')->nullable()->after('fecha');
            $table->unsignedBigInteger('respondido_por')->nullable()->index()->after('respondido_en');
        });
    }

    public function down(): void
    {
        Schema::table('mensajes', function (Blueprint $table) {
            $table->dropIndex(['cliente_id']);
            $table->dropIndex(['respondido_por']);
            $table->dropColumn(['cliente_id', 'leido_cliente', 'respuesta', 'respondido_en', 'respondido_por']);
        });
    }
};

