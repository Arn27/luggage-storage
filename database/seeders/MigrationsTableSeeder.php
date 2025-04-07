<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MigrationsTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('migrations')->insert([
            'id' => 1,
            'migration' => '0001_01_01_000001_create_cache_table',
            'batch' => 1
        ]);
        DB::table('migrations')->insert([
            'id' => 2,
            'migration' => '0001_01_01_000002_create_jobs_table',
            'batch' => 1
        ]);
        DB::table('migrations')->insert([
            'id' => 3,
            'migration' => '2025_01_01_000001_create_users_table',
            'batch' => 1
        ]);
        DB::table('migrations')->insert([
            'id' => 4,
            'migration' => '2025_01_01_000002_create_businesses_table',
            'batch' => 1
        ]);
        DB::table('migrations')->insert([
            'id' => 5,
            'migration' => '2025_01_01_000003_create_locations_table',
            'batch' => 1
        ]);
        DB::table('migrations')->insert([
            'id' => 6,
            'migration' => '2025_01_01_000004_create_images_table',
            'batch' => 1
        ]);
        DB::table('migrations')->insert([
            'id' => 7,
            'migration' => '2025_01_01_000005_create_bookings_table',
            'batch' => 1
        ]);
        DB::table('migrations')->insert([
            'id' => 8,
            'migration' => '2025_01_01_000006_create_reviews_table',
            'batch' => 1
        ]);
        DB::table('migrations')->insert([
            'id' => 9,
            'migration' => '2025_01_01_000007_create_availability_table',
            'batch' => 1
        ]);
        DB::table('migrations')->insert([
            'id' => 10,
            'migration' => '2025_04_05_184944_create_personal_access_tokens_table',
            'batch' => 2
        ]);
        DB::table('migrations')->insert([
            'id' => 11,
            'migration' => '2025_04_05_202304_add_is_admin_to_users_table',
            'batch' => 3
        ]);
        DB::table('migrations')->insert([
            'id' => 12,
            'migration' => '2025_04_05_204109_add_profile_fields_to_users_table',
            'batch' => 4
        ]);
        DB::table('migrations')->insert([
            'id' => 13,
            'migration' => '2025_04_05_213331_add_is_approved_to_businesses_table',
            'batch' => 5
        ]);
        DB::table('migrations')->insert([
            'id' => 14,
            'migration' => '2025_04_06_164538_add_hourly_rate_to_locations_table',
            'batch' => 6
        ]);
    }
}