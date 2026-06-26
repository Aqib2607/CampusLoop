<?php

namespace Database\Seeders;

use App\Models\Conversation;
use Faker\Factory as FakerFactory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ReviewSeeder extends Seeder
{
    private const REVIEW_COUNT = 2000;

    public function run(): void
    {
        $conversations = Conversation::query()
            ->join('listings', 'listings.id', '=', 'conversations.listing_id')
            ->join('categories', 'categories.id', '=', 'listings.category_id')
            ->select([
                'conversations.listing_id',
                'conversations.buyer_id',
                'conversations.seller_id',
                'conversations.created_at as conversation_created_at',
                'listings.title as listing_title',
                'categories.name as category_name',
            ])
            ->inRandomOrder()
            ->limit(self::REVIEW_COUNT)
            ->get();

        if ($conversations->count() !== self::REVIEW_COUNT) {
            throw new RuntimeException('ReviewSeeder requires at least '.self::REVIEW_COUNT.' conversations.');
        }

        $faker = FakerFactory::create('en_US');
        $rows = [];

        foreach ($conversations as $conversation) {
            $createdAt = $faker->dateTimeBetween($conversation->conversation_created_at, 'now')->format('Y-m-d H:i:s');
            $rows[] = [
                'reviewer_id' => $conversation->buyer_id,
                'reviewed_user_id' => $conversation->seller_id,
                'listing_id' => $conversation->listing_id,
                'rating' => $faker->randomElement([3, 4, 4, 4, 5, 5, 5, 5]),
                'review_text' => $this->reviewText($faker, $conversation->category_name, $conversation->listing_title),
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ];

            if (count($rows) === 500) {
                DB::table('reviews')->insert($rows);
                $rows = [];
            }
        }

        if ($rows !== []) {
            DB::table('reviews')->insert($rows);
        }
    }

    private function reviewText(\Faker\Generator $faker, string $category, string $title): string
    {
        $area = match (true) {
            $category === 'Books & Notes' => 'book purchase',
            $category === 'Electronics' => 'electronics sale',
            $category === 'Lab Equipment' => 'equipment transaction',
            $category === 'Student Essentials' => 'essentials purchase',
            default => 'campus marketplace transaction',
        };

        $specific = match ($area) {
            'book purchase' => 'The edition and page condition matched the listing, and the notes were genuinely useful for the course.',
            'electronics sale' => 'The device was demonstrated before payment, included the promised accessories, and worked exactly as described.',
            'equipment transaction' => 'The lab equipment was properly checked before handover, and the components worked perfectly for my project.',
            'essentials purchase' => 'The item was in great condition for daily campus use, exactly as listed in the photos.',
            'campus marketplace transaction' => 'The listing details were accurate, communication was clear, and everything promised was included at handover.',
        };

        return $specific.' Communication was prompt, the campus meetup felt safe, and the handover was completed on time.';
    }
}
