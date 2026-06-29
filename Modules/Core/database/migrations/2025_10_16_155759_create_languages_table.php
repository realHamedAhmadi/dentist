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
        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // English, Persian, Arabic, etc.
            $table->string('native_name')->nullable(); // English => "English", Persian => "فارسی"
            $table->string('code', 5)->unique(); // ISO 639-1 code, e.g. 'en', 'fa', 'ar'
            $table->enum('dir', [
                'LTR','RTL'
            ])->default('RTL');//direction
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('languages');
    }
};
