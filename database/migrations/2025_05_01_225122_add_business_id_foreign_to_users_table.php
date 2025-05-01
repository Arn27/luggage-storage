<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop existing constraint if it exists (safe way)
            $table->dropForeign(['business_id']);
    
            // Re-add it properly
            $table->foreign('business_id')
                  ->references('id')->on('business_profiles')
                  ->onDelete('set null');
        });
    }
    
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['business_id']);
        });
    }
    
};
