<?php

namespace Database\Factories;

use App\Models\ListingImage;
use App\Models\Listing;
use Illuminate\Database\Eloquent\Factories\Factory;

class ListingImageFactory extends Factory
{
    protected $model = ListingImage::class;

    public function definition(): array
    {
        return [
            'listing_id' => Listing::factory(),
            'image_url' => 'https://picsum.photos/seed/' . fake()->uuid() . '/800/600',
            'display_order' => 1,
        ];
    }
}
