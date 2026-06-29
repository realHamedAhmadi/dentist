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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('family_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedBigInteger('reference_file_number')->unique()->nullable();
            $table->string('physical_file_number',15)->unique()->nullable();
            $table->string('first_name',32);
            $table->string('last_name',32)->nullable();
            $table->string('phone',20)->nullable();
            $table->string('tel',20)->nullable();
            $table->unsignedInteger('national_code',20)->nullable();
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('father_name',32)->nullable();
            $table->foreignId('education_id')->nullable()->constrained('educations')->nullOnDelete();
            $table->string('job',32)->nullable();
            $table->foreignId('blood_group_id')->nullable()->constrained('blood_groups')->nullOnDelete();
            $table->boolean('is_married')->default(false);
            $table->boolean('is_pregnant')->default(false);
            $table->string('address',120)->nullable();
            $table->string('postal_code',20)->nullable();
            $table->string('notes',255)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
