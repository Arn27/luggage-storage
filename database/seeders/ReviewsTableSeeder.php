<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReviewsTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('reviews')->insert([
            'id' => 2,
            'user_id' => 2,
            'location_id' => 5,
            'rating' => 5,
            'comment' => 'Puikus aptarnavimas. Aciu!',
            'created_at' => '2025-04-06 21:57:27',
            'updated_at' => '2025-04-06 21:57:27'
        ]);
    }
}