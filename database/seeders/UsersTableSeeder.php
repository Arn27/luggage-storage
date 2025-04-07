<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->insert([
            'id' => 1,
            'name' => 'John Test',
            'email' => 'john@example.com',
            'phone' => null,
            'avatar_url' => null,
            'language' => 'en',
            'password' => '$2y$12$ALS2I5VBXU/FLQoKaIxV1em12hezkFe2s/GqpronDuSEKaZg5BiJy',
            'is_admin' => 0,
            'created_at' => '2025-04-05 16:59:57',
            'updated_at' => '2025-04-05 17:43:06'
        ]);
        DB::table('users')->insert([
            'id' => 2,
            'name' => 'Arnas',
            'email' => 'Arnas277@gmail.com',
            'phone' => null,
            'avatar_url' => null,
            'language' => 'en',
            'password' => '$2y$12$IYGZ6hPabwQAkn3voXPJrOnKEoqMq0eNgv8Tn/YKHRaon8Nc5D..y',
            'is_admin' => 1,
            'created_at' => '2025-04-05 19:19:02',
            'updated_at' => '2025-04-05 19:19:02'
        ]);
    }
}