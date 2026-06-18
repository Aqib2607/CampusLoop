<?php

namespace App\Repositories;

use App\Models\Listing;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class ListingRepository
{
    public function create(array $data): Listing
    {
        return Listing::create($data);
    }

    public function update(Listing $listing, array $data): Listing
    {
        $listing->update($data);
        return $listing->fresh();
    }

    public function delete(Listing $listing): void
    {
        $listing->delete();
    }

    public function updateStatus(Listing $listing, string $status): Listing
    {
        $extra = [];
        if ($status === 'published' && ! $listing->published_at) {
            $extra['published_at'] = now();
        }
        $listing->update(array_merge(['status' => $status], $extra));
        return $listing->fresh();
    }

    public function findById(int $id, array $with = []): ?Listing
    {
        return Listing::with($with)->find($id);
    }

    public function search(array $filters): LengthAwarePaginator
    {
        $query = Listing::with(['user.ratingSummary', 'category', 'images'])
            ->where('status', 'published');

        // Full-text keyword search
        if (! empty($filters['search'])) {
            $query->whereFullText(['title', 'description'], $filters['search']);
        }

        // Category filter
        if (! empty($filters['category'])) {
            $query->where('category_id', $filters['category']);
        }

        // Price range
        if (! empty($filters['price_min'])) {
            $query->where('price', '>=', $filters['price_min']);
        }
        if (! empty($filters['price_max'])) {
            $query->where('price', '<=', $filters['price_max']);
        }

        // Condition filter
        if (! empty($filters['condition'])) {
            $query->where('condition', $filters['condition']);
        }

        // Rating filter (join with rating_summaries)
        if (! empty($filters['rating'])) {
            $query->whereHas('user.ratingSummary', function (Builder $q) use ($filters) {
                $q->where('average_rating', '>=', $filters['rating']);
            });
        }

        // Sorting
        $sort = $filters['sort'] ?? 'latest';
        match ($sort) {
            'price_asc'   => $query->orderBy('price'),
            'price_desc'  => $query->orderByDesc('price'),
            'popular'     => $query->orderByDesc('view_count'),
            default       => $query->latest(),
        };

        $perPage = min((int) ($filters['per_page'] ?? 20), 50);

        return $query->paginate($perPage);
    }

    public function getByUser(int $userId): \Illuminate\Database\Eloquent\Collection
    {
        return Listing::with(['images', 'category'])
            ->where('user_id', $userId)
            ->latest()
            ->get();
    }

    public function getPending(): LengthAwarePaginator
    {
        return Listing::with(['user', 'category', 'images', 'latestAiModerationLog'])
            ->where('status', 'pending')
            ->latest()
            ->paginate(20);
    }

    public function getExpired(): \Illuminate\Database\Eloquent\Collection
    {
        return Listing::expired()->get();
    }
}
