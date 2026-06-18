<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ListingImage;
use App\Models\Listing;
use Illuminate\Support\Str;

class ListingImageSeeder extends Seeder
{
    public function run(): void
    {
        // Only published/approved/sold listings usually have images shown, but let's give images to published ones.
        $listings = Listing::where('status', 'published')->pluck('id')->toArray();
        $images = [];
        $now = now();

        foreach ($listings as $listingId) {
            $numImages = fake()->numberBetween(3, 8);
            for ($i = 1; $i <= $numImages; $i++) {
                $images[] = [
                    'listing_id' => $listingId,
                    'image_url' => 'https://picsum.photos/seed/' . Str::random(10) . '/800/600',
                    'display_order' => $i,
                ];
            }
        }

        // Bulk insert
        $chunks = array_chunk($images, 500);
        foreach ($chunks as $chunk) {
            ListingImage::insert($chunk);
        }
    }
}
