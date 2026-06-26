<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use InvalidArgumentException;

class ListingFactory extends Factory
{
    protected $model = Listing::class;

    public const CATEGORY_PROFILES = [
        'Books & Notes' => [
            'count' => 1200,
            'price' => [5, 150],
            'titles' => ['Textbooks', 'Reference Books', 'Study Notes', 'Previous Question Papers', 'Lab Manuals', 'Programming Books', 'Business Books', 'Medical Books', 'Engineering Books', 'Admission Books'],
            'details' => 'All pages are present and readable. Any highlighting, margin notes, edition details, and course relevance are reflected in the condition shown.',
        ],
        'Electronics' => [
            'count' => 800,
            'price' => [50, 1500],
            'titles' => ['Laptops', 'Tablets', 'Scientific Calculators', 'Monitors', 'Mechanical Keyboards', 'Mouse', 'Headphones', 'Power Banks', 'External SSDs', 'USB Drives'],
            'details' => 'The device has been tested before listing. Battery condition, included charger or accessories, cosmetic marks, and any remaining warranty can be checked during pickup.',
        ],
        'Lab Equipment' => [
            'count' => 600,
            'price' => [10, 150],
            'titles' => ['Arduino', 'Raspberry Pi', 'Breadboards', 'Sensors', 'Electronic Components', 'Multimeters', 'Oscilloscopes', 'Engineering Toolkits', 'Circuit Boards', 'Development Kits'],
            'details' => 'Suitable for undergraduate laboratory and project work. Components have been checked, and the exact accessories, model, and compatibility are listed for verification.',
        ],
        'Student Essentials' => [
            'count' => 400,
            'price' => [2, 50],
            'titles' => ['Backpacks', 'Stationery', 'Drawing Instruments', 'Geometry Sets', 'Water Bottles', 'Desk Organizers', 'File Folders', 'Notebooks', 'Exam Accessories', 'Writing Supplies'],
            'details' => 'A practical item for everyday campus use. The listing accurately notes what is included, how long it was used, and any small signs of wear.',
        ],
    ];

    public function definition(): array
    {
        $categoryName = fake()->randomElement(array_keys(self::CATEGORY_PROFILES));
        $profile = self::CATEGORY_PROFILES[$categoryName];
        $status = fake()->randomElement(['published', 'published', 'published', 'published', 'pending', 'approved', 'rejected', 'paused', 'sold', 'archived']);

        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'title' => fake()->randomElement($profile['titles']).' - '.fake()->words(2, true),
            'description' => $profile['details'].' '.fake()->realText(500),
            'price' => fake()->randomFloat(2, $profile['price'][0], $profile['price'][1]),
            'condition' => fake()->randomElement(['new', 'like_new', 'good', 'fair', 'poor']),
            'negotiable' => $categoryName !== 'Lost & Found' && fake()->boolean(70),
            'status' => $status,
            'expiry_date' => fake()->dateTimeBetween('now', '+2 months'),
            'sold_at' => $status === 'sold' ? fake()->dateTimeBetween('-1 month', 'now') : null,
            'published_at' => in_array($status, ['published', 'paused', 'sold', 'archived'], true) ? fake()->dateTimeBetween('-2 months', 'now') : null,
            'view_count' => fake()->numberBetween(0, 1200),
            'location' => fake()->randomElement(['Main Campus', 'Central Library', 'Student Centre', 'North Hall', 'Engineering Building', 'Campus Gate']),
        ];
    }

    public function forCategory(Category|string $category): static
    {
        $categoryName = $category instanceof Category ? $category->name : $category;
        $categoryId = $category instanceof Category
            ? $category->getKey()
            : Category::query()->where('name', $categoryName)->value('id');

        if (! isset(self::CATEGORY_PROFILES[$categoryName]) || ! $categoryId) {
            throw new InvalidArgumentException("Unknown seeded marketplace category: {$categoryName}");
        }

        return $this->state(function () use ($categoryName, $categoryId): array {
            $profile = self::CATEGORY_PROFILES[$categoryName];

            return [
                'category_id' => $categoryId,
                'title' => fake()->randomElement($profile['titles']).' - '.fake()->words(2, true),
                'description' => $profile['details'].' '.fake()->realText(500),
                'price' => fake()->randomFloat(2, $profile['price'][0], $profile['price'][1]),
                'negotiable' => $categoryName !== 'Lost & Found' && fake()->boolean(70),
            ];
        });
    }
}
