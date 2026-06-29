<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('position_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('shift_id')->nullable()->constrained()->nullOnDelete();
            $table->date('hire_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('national_code',15)->nullable();
            $table->string('employee_code',20)->unique()->nullable();
            $table->foreignId('contract_type_id')->nullable()->constrained()->nullOnDelete(); // تمام وقت، پاره وقت، پیمانی
            $table->string('address',255)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff');
    }
};
