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
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('coupon_code',50)->unique()->nullable();
            $table->enum('type',['percentage','fixed'])->default('percentage');
            $table->unsignedInteger('min_order_amount')->default('0');
            $table->integer('usage_limit')->nullable();
            $table->integer('usage_count')->default(0);
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('value');
            $table->timestamps();

            $table->index('coupon_code');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};
