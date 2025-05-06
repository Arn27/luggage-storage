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
        DB::statement("ALTER TABLE bookings CHANGE status status ENUM('pending_start', 'active', 'pending_end', 'completed') DEFAULT 'pending_start'");
    }
    
    public function down()
    {
        DB::statement("ALTER TABLE bookings CHANGE status status ENUM('pending', 'confirmed', 'active', 'completed') DEFAULT 'pending'");
    }
    
};
