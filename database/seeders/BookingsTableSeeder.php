<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BookingsTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('bookings')->insert([
            'id' => 3,
            'user_id' => 2,
            'location_id' => 5,
            'date' => '2025-04-08',
            'bag_count' => 1,
            'status' => 'pending',
            'created_at' => '2025-04-06 22:05:03',
            'updated_at' => '2025-04-06 22:05:03'
        ]);
    }
}