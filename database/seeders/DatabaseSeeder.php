<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesTableSeeder::class,
        ]);
    }
}
