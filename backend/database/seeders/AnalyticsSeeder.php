<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnalyticsSeeder extends Seeder
{
    public function run(): void
    {
        $days = 60;
        $weights = array_map(fn (int $day) => 40 + $day + random_int(0, 25), range(0, $days - 1));
        $newUsers = $this->distribute(600, $weights);
        $newListings = $this->distribute(3000, $weights);
        $messages = $this->distribute(18500, $weights);
        $reports = $this->distribute(180, $weights);
        $start = Carbon::today()->subDays($days - 1);
        $now = now();
        $statistics = [];

        for ($day = 0; $day < $days; $day++) {
            $statistics[] = [
                'date' => $start->copy()->addDays($day)->format('Y-m-d'),
                'new_users' => $newUsers[$day],
                'new_listings' => $newListings[$day],
                'total_messages' => $messages[$day],
                'reports_created' => $reports[$day],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('daily_statistics')->upsert(
            $statistics,
            ['date'],
            ['new_users', 'new_listings', 'total_messages', 'reports_created', 'updated_at'],
        );
    }

    private function distribute(int $total, array $weights): array
    {
        $weightTotal = array_sum($weights);
        $values = array_map(fn (int $weight) => (int) floor($total * $weight / $weightTotal), $weights);
        $remainder = $total - array_sum($values);

        for ($i = 0; $i < $remainder; $i++) {
            $values[count($values) - 1 - ($i % count($values))]++;
        }

        return $values;
    }
}
