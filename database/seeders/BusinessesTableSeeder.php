<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BusinessesTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('businesses')->insert([
            'id' => 3,
            'business_name' => 'UAB \"Gera įmonė\"',
            'email' => 'arnas.sidlauskas@vvk.lt',
            'is_approved' => 1,
            'password' => '$2y$12$Jb6N9hc0fzWfHTfl3IGqFOb3nxaqRsQEIxgRFGwQAaXI0oFkOy8du',
            'phone' => '07475457174',
            'created_at' => '2025-04-06 15:01:19',
            'updated_at' => '2025-04-06 15:03:26'
        ]);
        DB::table('businesses')->insert([
            'id' => 4,
            'business_name' => 'UAB \"Gera įmonė2\"',
            'email' => 'anras@arnas.lt',
            'is_approved' => 1,
            'password' => '$2y$12$zBioykY8lRYbUwDDzbSP3OytVd76cVAdesidV4KuYbqTN48KOHT8i',
            'phone' => '07475457174',
            'created_at' => '2025-04-06 22:07:24',
            'updated_at' => '2025-04-06 22:08:05'
        ]);
    }
}