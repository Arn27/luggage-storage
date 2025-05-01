<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateForeignKeyOnLocationsTable extends Migration
{
    public function up()
    {
        Schema::table('locations', function (Blueprint $table) {
            // Drop old foreign key
            $table->dropForeign(['business_id']);

            // Set new one
            $table->foreign('business_id')
                  ->references('id')
                  ->on('business_profiles')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropForeign(['business_id']);
            $table->foreign('business_id')
                  ->references('id')
                  ->on('businesses') // old
                  ->onDelete('cascade');
        });
    }
}
