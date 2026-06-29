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
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('iso2', 2);
            $table->string('iso3', 3);
            $table->string('phone_code');
            $table->unsignedTinyInteger('min_phone_length')->nullable();
            $table->unsignedTinyInteger('max_phone_length')->nullable();
            $table->string('capital')->nullable();
            $table->string('continent')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('countries');
    }
};
