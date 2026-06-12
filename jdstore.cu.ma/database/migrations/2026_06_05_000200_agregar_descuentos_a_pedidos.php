<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->decimal('subtotal', 10, 2)->default(0)->after('cliente_id');
            $table->decimal('descuento_total', 10, 2)->default(0)->after('total');
            $table->string('cupon_codigo', 50)->nullable()->after('descuento_total');
        });
    }

    public function down(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->dropColumn(['subtotal', 'descuento_total', 'cupon_codigo']);
        });
    }
};
