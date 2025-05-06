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
        Schema::table('bookings', function (Blueprint $table) {
            if (!Schema::hasColumn('bookings', 'is_walkin')) {
                $table->boolean('is_walkin')->default(false);
            }
    
            // Don't redefine if already exists
            if (!Schema::hasColumn('bookings', 'status')) {
                $table->enum('status', ['pending_start', 'active', 'pending_end', 'completed'])->default('pending_start');
            }
    
            if (!Schema::hasColumn('bookings', 'user_start_photo')) {
                $table->text('user_start_photo')->nullable();
            }
            if (!Schema::hasColumn('bookings', 'business_start_photo')) {
                $table->text('business_start_photo')->nullable();
            }
            if (!Schema::hasColumn('bookings', 'user_end_photo')) {
                $table->text('user_end_photo')->nullable();
            }
            if (!Schema::hasColumn('bookings', 'business_end_photo')) {
                $table->text('business_end_photo')->nullable();
            }
            if (!Schema::hasColumn('bookings', 'started_at')) {
                $table->dateTime('started_at')->nullable();
            }
            if (!Schema::hasColumn('bookings', 'ended_at')) {
                $table->dateTime('ended_at')->nullable();
            }
        });
    }
    
    
    public function down()
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'is_walkin',
                'status',
                'user_start_photo',
                'business_start_photo',
                'user_end_photo',
                'business_end_photo',
                'started_at',
                'ended_at',
            ]);
        });
    }
    
};
