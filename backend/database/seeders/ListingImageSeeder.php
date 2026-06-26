<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ListingImageSeeder extends Seeder
{
    private const CHUNK = 500;

    public function run(): void
    {
        // Fetch listing id, title, AND category name for semantic image matching.
        $listings = DB::table('listings')
            ->join('categories', 'listings.category_id', '=', 'categories.id')
            ->whereNull('listings.deleted_at')
            ->select(
                'listings.id as listing_id',
                'listings.title as listing_title',
                'categories.name as category_name'
            )
            ->orderBy('listings.id')
            ->get();

        $now    = now()->toDateTimeString();
        $rows   = [];
        $random = new \Random\Randomizer();

        foreach ($listings as $listing) {
            // Enforce 4–8 images per listing as per listing_image_requirements.
            $count = $random->getInt(4, 8);

            // Semantic pick: match title keywords → curated product photography.
            $urls = ImageDataset::pick(
                $listing->category_name,
                $listing->listing_title,
                $count
            );

            foreach ($urls as $order => $url) {
                $rows[] = [
                    'listing_id'    => $listing->listing_id,
                    'image_url'     => $url,
                    'display_order' => $order + 1,
                    'created_at'    => $now,
                    'updated_at'    => $now,
                ];
            }

            if (count($rows) >= self::CHUNK) {
                DB::table('listing_images')->insert($rows);
                $rows = [];
            }
        }

        if ($rows !== []) {
            DB::table('listing_images')->insert($rows);
        }
    }
}
