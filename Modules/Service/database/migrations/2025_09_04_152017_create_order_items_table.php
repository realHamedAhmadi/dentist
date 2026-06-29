<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('order_id');
            $table->foreignId('client_id')->constrained('clients')->onDelete('restrict');
            $table->foreignId('service_id')->constrained('services')->onDelete('restrict');
            $table->unsignedBigInteger('provider_id')->nullable();
            if (Schema::hasTable('users'))
                $table->foreign('provider_id')->references('id')->on('users')->onDelete('set null');
            $table->unsignedBigInteger('registrar_id')->nullable();
            if (Schema::hasTable('users'))
                $table->foreign('registrar_id')->references('id')->on('users')->onDelete('set null');
            $table->unsignedBigInteger('price');
            $table->unsignedBigInteger('discount')->default(0);
            $table->unsignedBigInteger('final_price');
            $table->foreignId('provider_specialty_id')->nullable();
            if (Schema::hasTable('specialty_id'))
                $table->foreign('specialty_id')->references('id')->on('specialties')->onDelete('set null');
            $table->enum('provider_share_type',['percentage','fixed'])->default('percentage');
            $table->unsignedInteger('provider_share_value')->default(0);
            $table->timestamp('service_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
