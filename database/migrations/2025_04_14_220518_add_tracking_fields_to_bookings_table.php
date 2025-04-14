<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
// In the migration file
public function up()
{
    Schema::table('bookings', function (Blueprint $table) {
        $table->timestamp('start_time')->nullable();
        $table->timestamp('end_time')->nullable();
        $table->string('user_luggage_photo')->nullable();
        $table->string('business_luggage_photo')->nullable();
        $table->string('user_close_photo')->nullable();
        $table->string('business_close_photo')->nullable();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'start_time',
                'end_time',
                'user_luggage_photo',
                'business_luggage_photo',
                'user_close_photo',
                'business_close_photo'
            ]);
        });
    }
};
