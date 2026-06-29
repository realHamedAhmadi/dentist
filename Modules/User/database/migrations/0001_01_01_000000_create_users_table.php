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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name',32);
            $table->string('last_name',32)->nullable();
            $table->string('phone',32)->nullable()->unique();
            $table->string('email',64)->nullable()->unique();
            $table->string('username',64)->nullable()->unique();
            $table->string('password',120)->nullable();
            $table->dateTime('registered_at')->nullable();
            $table->dateTime('last_login_at')->nullable();
            $table->dateTime('last_activity_at')->nullable();
            $table->dateTime('phone_verified_at')->nullable();
            $table->dateTime('email_verified_at')->nullable();
            $table->rememberToken()->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('phone',32)->unique();
            $table->string('email',64)->nullable()->unique();
            $table->string('token',150);
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id',64)->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
