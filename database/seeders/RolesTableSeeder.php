<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role; // ✅ add this

class RolesTableSeeder extends Seeder
{
    public function run(): void
    {
        Role::insert([
            ['name' => 'admin'],
            ['name' => 'business'],
            ['name' => 'traveller'],
        ]);
    }
}
