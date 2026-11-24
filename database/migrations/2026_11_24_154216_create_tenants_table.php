<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Run against the landlord connection
    protected $connection = 'landlord';

    public function up(): void
    {
        Schema::connection('landlord')->create('tenants', function (Blueprint $table) {
            $table->id();

            $table->string('name');

            // Unique custom domain (e.g. clinic.example.com) — highest priority in finder
            $table->string('domain')->nullable()->unique();

            // Subdomain slug (e.g. "clinic-a" for clinic-a.yoursaas.com)
            $table->string('subdomain')->nullable()->unique();

            // Physical database name for this tenant's isolated DB
            $table->string('database')->unique();

            // Lifecycle status
            $table->enum('status', ['provisioning', 'active', 'suspended', 'failed'])
                ->default('provisioning');

            $table->string('plan')->default('basic');
            $table->string('owner_email');
            $table->timestamp('provisioned_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::connection('landlord')->dropIfExists('tenants');
    }
};
