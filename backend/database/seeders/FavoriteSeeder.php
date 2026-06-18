<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Favorite;
use App\Models\User;
use App\Models\Listing;

class FavoriteSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::pluck('id')->toArray();
        $listings = Listing::pluck('id')->toArray();

        if (empty($users) || empty($listings)) return;

        $favorites = [];
        $uniquePairs = [];
        $now = now();

        // 8000 favorites
        while (count($favorites) < 8000) {
            $userId = fake()->randomElement($users);
            $listingId = fake()->randomElement($listings);
            $key = $userId . '-' . $listingId;

            if (!isset($uniquePairs[$key])) {
                $uniquePairs[$key] = true;
                $favorites[] = [
                    'user_id' => $userId,
                    'listing_id' => $listingId,
                    'created_at' => $now,
                ];
            }
        }

        $chunks = array_chunk($favorites, 500);
        foreach ($chunks as $chunk) {
            Favorite::insert($chunk);
        }
    }
}
