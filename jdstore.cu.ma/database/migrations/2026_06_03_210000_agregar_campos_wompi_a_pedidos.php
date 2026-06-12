<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->string('proveedor_pago', 40)->nullable()->after('metodo_pago');
            $table->string('estado_pago', 40)->nullable()->after('proveedor_pago');
            $table->string('referencia_pago', 120)->nullable()->unique()->after('estado_pago');
            $table->string('wompi_payment_link_id', 120)->nullable()->after('referencia_pago');
            $table->string('wompi_transaction_id', 120)->nullable()->after('wompi_payment_link_id');
            $table->string('wompi_checkout_url')->nullable()->after('wompi_transaction_id');
            $table->json('wompi_payload')->nullable()->after('wompi_checkout_url');
        });
    }

    public function down(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->dropUnique(['referencia_pago']);
            $table->dropColumn([
                'proveedor_pago',
                'estado_pago',
                'referencia_pago',
                'wompi_payment_link_id',
                'wompi_transaction_id',
                'wompi_checkout_url',
                'wompi_payload',
            ]);
        });
    }
};
