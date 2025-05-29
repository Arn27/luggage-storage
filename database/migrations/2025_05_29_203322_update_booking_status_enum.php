<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateBookingStatusEnum extends Migration
{
    public function up()
    {
        DB::statement("ALTER TABLE bookings 
            MODIFY status ENUM(
                'pending_start', 
                'user_started', 
                'business_started', 
                'active', 
                'pending_end', 
                'completed', 
                'cancelled', 
                'declined', 
                'rejected', 
                'no_show'
            ) NOT NULL DEFAULT 'pending_start'");
    }

    public function down()
    {
        DB::statement("ALTER TABLE bookings 
            MODIFY status ENUM(
                'pending_start', 
                'user_started', 
                'business_started', 
                'active', 
                'pending_end', 
                'completed'
            ) NOT NULL DEFAULT 'pending_start'");
    }
}
