<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'user_close_photo',
                'business_close_photo',
                'start_time',
                'end_time',
            ]);

            $table->decimal('fee_to_pay', 8, 2)->nullable()->after('ended_at');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('user_close_photo')->nullable();
            $table->string('business_close_photo')->nullable();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();

            $table->dropColumn('fee_to_pay');
        });
    }
};
