<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Listing;
use App\Models\User;
use Database\Factories\ListingFactory;
use Faker\Factory as FakerFactory;
use Illuminate\Database\Seeder;
use RuntimeException;

class ListingSeeder extends Seeder
{
    private const STATUS_COUNTS = [
        'published' => 2200,
        'pending' => 250,
        'approved' => 150,
        'rejected' => 100,
        'paused' => 100,
        'sold' => 150,
        'archived' => 50,
    ];

    public function run(): void
    {
        $userIds = User::query()->pluck('id')->all();
        $categories = Category::query()->active()->pluck('id', 'name');

        if ($userIds === []) {
            throw new RuntimeException('ListingSeeder requires users to be seeded first.');
        }

        $missingCategories = array_diff(array_keys(ListingFactory::CATEGORY_PROFILES), $categories->keys()->all());
        if ($missingCategories !== []) {
            throw new RuntimeException('Missing marketplace categories: '.implode(', ', $missingCategories));
        }

        $statuses = [];
        foreach (self::STATUS_COUNTS as $status => $count) {
            array_push($statuses, ...array_fill(0, $count, $status));
        }
        shuffle($statuses);

        $faker = FakerFactory::create('en_US');
        $now = now();
        $rows = [];

        foreach (ListingFactory::CATEGORY_PROFILES as $categoryName => $profile) {
            for ($i = 0; $i < $profile['count']; $i++) {
                $status = array_pop($statuses);
                $createdAt = $faker->dateTimeBetween('-60 days', 'now');
                $publishedAt = in_array($status, ['published', 'paused', 'sold', 'archived'], true)
                    ? $faker->dateTimeBetween($createdAt, 'now')->format('Y-m-d H:i:s')
                    : null;

                $rows[] = [
                    'user_id' => $faker->randomElement($userIds),
                    'category_id' => $categories[$categoryName],
                    'title' => $faker->randomElement($profile['titles']).' - '.ucfirst($faker->words(2, true)),
                    'description' => $this->description($faker, $profile['details']),
                    'price' => $faker->randomFloat(2, $profile['price'][0], $profile['price'][1]),
                    'condition' => $faker->randomElement(['new', 'like_new', 'good', 'good', 'fair', 'poor']),
                    'negotiable' => $categoryName !== 'Lost & Found' && $faker->boolean(70),
                    'status' => $status,
                    'expiry_days' => 60,
                    'expiry_date' => $faker->dateTimeBetween('now', '+60 days')->format('Y-m-d H:i:s'),
                    'sold_at' => $status === 'sold' ? $faker->dateTimeBetween($createdAt, 'now')->format('Y-m-d H:i:s') : null,
                    'published_at' => $publishedAt,
                    'view_count' => $faker->numberBetween(5, 1200),
                    'location' => $faker->randomElement(['Main Campus', 'Central Library', 'Student Centre', 'North Hall', 'Engineering Building', 'Campus Gate']),
                    'created_at' => $createdAt->format('Y-m-d H:i:s'),
                    'updated_at' => $now,
                ];

                if (count($rows) === 500) {
                    Listing::query()->insert($rows);
                    $rows = [];
                }
            }
        }

        if ($rows !== []) {
            Listing::query()->insert($rows);
        }

        if ($statuses !== []) {
            throw new RuntimeException('Listing status distribution does not match the category total.');
        }
    }

    private function description(\Faker\Generator $faker, string $context): string
    {
        $targetWords = $faker->numberBetween(150, 260);
        $opening = $context.' Available to verified CampusLoop members. The asking price reflects the stated condition and current student-market value.';
        $remaining = max(0, $targetWords - str_word_count($opening));
        $body = implode(' ', $faker->words($remaining));

        return $opening."\n\n".$body."\n\nPickup is available near the main library, student centre, or another mutually convenient public campus location.";
    }
}
