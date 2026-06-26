<?php

namespace Database\Factories;

use App\Models\Listing;
use App\Models\ListingImage;
use Database\Seeders\ImageDataset;
use Illuminate\Database\Eloquent\Factories\Factory;

class ListingImageFactory extends Factory
{
    protected $model = ListingImage::class;

    public function definition(): array
    {
        // Generic fallback for factory usage outside of seeding context.
        $urls = ImageDataset::pick('Electronics', 'Laptops', 1);

        return [
            'listing_id'    => Listing::factory(),
            'image_url'     => $urls[0],
            'display_order' => 1,
        ];
    }

    /**
     * Produce a factory state pre-loaded with a semantically appropriate image.
     *
     * @param  string  $category      Category name (e.g. "Electronics")
     * @param  string  $title         Listing title for keyword matching (e.g. "Laptops")
     * @param  int     $displayOrder  Display order index (1-based)
     */
    public function forCategory(string $category, string $title = '', int $displayOrder = 1): static
    {
        return $this->state(function () use ($category, $title, $displayOrder): array {
            $urls = ImageDataset::pick($category, $title ?: $category, 1);

            return [
                'image_url'     => $urls[0],
                'display_order' => $displayOrder,
            ];
        });
    }
}
