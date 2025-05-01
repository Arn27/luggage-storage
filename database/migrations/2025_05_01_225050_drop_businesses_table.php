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
        Schema::dropIfExists('businesses');
    }
    
    public function down()
    {
        // You can recreate the table here if needed
        Schema::create('businesses', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });
    }
    
};
