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
        Schema::create('developer_settings', function (Blueprint $table) {
            $table->id();
            $table->string('country',5)->default('iran');
            $table->string('local',5)->default('fa');
            $table->enum('dir', [
                'LTR','RTL'
            ])->default('RTL');//direction
            $table->string('timezone',20)->default('Asia/Tehran');
            $table->string('currency',5)->default('IRR');
            $table->tinyInteger('min_phone_length')->default(10);
            $table->tinyInteger('max_phone_length')->default(10);
            $table->tinyInteger('country_phone_code')->default('98');
            $table->boolean('national_code_is_numeric')->default(true);
            $table->tinyInteger('min_national_code_length')->default(10);
            $table->tinyInteger('max_national_code_length')->default(10);
            $table->enum('calendar',[
               'gregorian','jalali','hijri'
            ])->default('jalali');
            $table->string('verification_channel',20)->nullable();
            $table->tinyInteger('verification_max_attempts')->default(5);
            $table->unsignedInteger('verification_ttl')->default(5);
            $table->unsignedInteger('verification_resend_in_minutes')->default(2);
            $table->unsignedInteger('verification_code_length')->default(6);
            $table->boolean('verification_code_is_numeric')->default(true);
            $table->timestamps();
        });
        try {
            \Illuminate\Support\Facades\DB::table('developer_settings')->insert(['id'=>1]);
        }catch (Throwable $e){
           $this->down();
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('developer_settings');
    }
};
