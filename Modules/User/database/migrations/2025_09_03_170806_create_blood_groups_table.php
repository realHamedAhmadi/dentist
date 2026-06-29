<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('blood_groups', function (Blueprint $table) {
            $table->id();
            $table->string('name',5);
            $table->string('rh',2)->default('+');
            $table->timestamps();
        });

        $groups=['A','B','AB','O'];
        try {
            foreach ($groups as $group){
                DB::table('blood_groups')->insert([
                    ['name'=>$group,'rh'=>'+'],
                    ['name'=>$group,'rh'=>'-'],
                ]);
            }
        }catch (\Exception $e){
            Schema::dropIfExists('blood_groups');
            throw  new \Exception($e->getMessage());
        }

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blood_groups');
    }
};
