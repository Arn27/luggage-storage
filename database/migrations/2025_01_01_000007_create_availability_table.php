
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('availability', function (Blueprint $table) {
            $table->id();
            $table->foreignId('location_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->unsignedInteger('bags_booked');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('availability');
    }
};
