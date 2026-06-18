<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsSeeder extends Seeder
{
    public function run(): void
    {
        $stats = [];
        $date = Carbon::now()->subDays(60);

        for ($i = 0; $i < 60; $i++) {
            $stats[] = [
                'date' => $date->format('Y-m-d'),
                'new_users' => rand(5, 50),
                'new_listings' => rand(10, 100),
                'total_messages' => rand(100, 1000),
                'reports_created' => rand(0, 10),
            ];
            $date->addDay();
        }

        DB::table('daily_statistics')->insert($stats);
    }
}
