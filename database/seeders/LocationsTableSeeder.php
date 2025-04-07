<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationsTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('locations')->insert([
            'id' => 4,
            'business_id' => 3,
            'name' => 'Gera Vieta',
            'address' => 'Klaipėdos g. 16, 01117 Vilnius, Lithuania',
            'city' => 'Vilnius',
            'lat' => '54.6817628',
            'lng' => '25.2800627',
            'description' => 'Puiki vieta jūsų bagažui.',
            'max_bags' => 20,
            'open_hours' => '{\"from\":\"06:00\",\"to\":\"22:00\"}',
            'created_at' => '2025-04-06 18:39:25',
            'updated_at' => '2025-04-06 18:40:25',
            'hourly_rate' => '1.00'
        ]);
        DB::table('locations')->insert([
            'id' => 5,
            'business_id' => 3,
            'name' => 'Gera Vieta2',
            'address' => 'Konstitucijos pr. 22, 09309 Vilnius, Lithuania',
            'city' => 'Vilnius',
            'lat' => '54.6968351',
            'lng' => '25.2708548',
            'description' => 'Labai gera vieta palikti savo bagažą',
            'max_bags' => 1,
            'open_hours' => '{\"from\":\"08:00\",\"to\":\"20:00\"}',
            'created_at' => '2025-04-06 18:41:28',
            'updated_at' => '2025-04-06 18:41:28',
            'hourly_rate' => '1.50'
        ]);
        DB::table('locations')->insert([
            'id' => 6,
            'business_id' => 3,
            'name' => 'Gera vieta 3',
            'address' => 'Verkių g. 15, 08219 Vilnius, Lithuania',
            'city' => 'Vilnius',
            'lat' => '54.7062987',
            'lng' => '25.2870973',
            'description' => 'Puiki vieta palikti savo bagažą',
            'max_bags' => 10,
            'open_hours' => '{\"from\":\"08:00\",\"to\":\"20:00\"}',
            'created_at' => '2025-04-06 18:42:58',
            'updated_at' => '2025-04-06 18:42:58',
            'hourly_rate' => '1.00'
        ]);
        DB::table('locations')->insert([
            'id' => 7,
            'business_id' => 3,
            'name' => 'Gera Vieta 4',
            'address' => 'Laisvės al., Kaunas, Kauno m. sav., Lithuania',
            'city' => 'Kaunas',
            'lat' => '54.8969783',
            'lng' => '23.9205158',
            'description' => 'Puiki vieta jūsų bagažui',
            'max_bags' => 1,
            'open_hours' => '{\"from\":\"06:00\",\"to\":\"20:00\"}',
            'created_at' => '2025-04-07 19:58:05',
            'updated_at' => '2025-04-07 19:58:05',
            'hourly_rate' => '1.20'
        ]);
    }
}