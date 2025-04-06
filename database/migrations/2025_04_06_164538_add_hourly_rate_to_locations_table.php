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
        Schema::table('locations', function (Blueprint $table) {
            $table->decimal('hourly_rate', 8, 2)->default(0);
        });
    }
    
    public function down()
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn('hourly_rate');
        });
    }
    
};
