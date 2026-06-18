<?php

namespace App\Services\Marketplace;

use App\Models\Listing;
use App\Models\User;
use App\Repositories\ListingRepository;
use App\Services\Audit\AuditLogService;
use App\Services\Media\CloudinaryService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ListingService
{
    public function __construct(
        private readonly ListingRepository $listingRepo,
        private readonly CloudinaryService $cloudinaryService,
        private readonly AuditLogService $auditLogService
    ) {}

    public function create(User $user, array $data, array $images = []): Listing
    {
        return DB::transaction(function () use ($user, $data, $images) {
            $expiryDays = $data['expiry_days'] ?? 30;

            $listing = $this->listingRepo->create([
                'user_id'     => $user->id,
                'category_id' => $data['category_id'],
                'title'       => $data['title'],
                'description' => $data['description'],
                'price'       => $data['price'],
                'condition'   => $data['condition'] ?? 'good',
                'negotiable'  => $data['negotiable'] ?? false,
                'location'    => $data['location'] ?? null,
                'expiry_days' => $expiryDays,
                'expiry_date' => now()->addDays($expiryDays),
                'status'      => 'pending',
            ]);

            // Upload images
            foreach ($images as $image) {
                $this->uploadListingImage($listing, $image);
            }

            $this->auditLogService->log('create', 'listings', $listing->id, null, $listing->toArray());

            return $listing->load(['images', 'category', 'user']);
        });
    }

    public function update(Listing $listing, array $data): Listing
    {
        $old = $listing->toArray();

        $this->listingRepo->update($listing, array_filter([
            'title'       => $data['title'] ?? null,
            'description' => $data['description'] ?? null,
            'price'       => $data['price'] ?? null,
            'condition'   => $data['condition'] ?? null,
            'negotiable'  => $data['negotiable'] ?? null,
            'category_id' => $data['category_id'] ?? null,
            'location'    => $data['location'] ?? null,
        ], fn ($v) => $v !== null));

        $this->auditLogService->logModelChange('update', 'listings', $listing->id, $old, $listing->fresh()->toArray());

        return $listing->fresh(['images', 'category', 'user']);
    }

    public function delete(Listing $listing): void
    {
        // Delete Cloudinary images
        foreach ($listing->images as $image) {
            if ($image->public_id) {
                $this->cloudinaryService->delete($image->public_id);
            }
        }

        $this->auditLogService->log('delete', 'listings', $listing->id, $listing->toArray());
        $this->listingRepo->delete($listing);
    }

    public function pause(Listing $listing): Listing
    {
        $this->ensureCanModify($listing);
        return $this->listingRepo->updateStatus($listing, 'paused');
    }

    public function resume(Listing $listing): Listing
    {
        $this->ensureCanModify($listing);
        return $this->listingRepo->updateStatus($listing, 'published');
    }

    public function markSold(Listing $listing): Listing
    {
        $listing->update(['status' => 'sold', 'sold_at' => now()]);
        return $listing->fresh();
    }

    public function renew(Listing $listing, int $days = 30): Listing
    {
        $listing->update([
            'expiry_days' => $days,
            'expiry_date' => now()->addDays($days),
            'status'      => 'pending', // Re-enters moderation
        ]);
        return $listing->fresh();
    }

    public function uploadListingImage(Listing $listing, UploadedFile $file): void
    {
        $result = $this->cloudinaryService->uploadImage($file, 'campusloop/listings');
        $listing->images()->create([
            'image_url'     => $result['url'],
            'public_id'     => $result['public_id'],
            'display_order' => $listing->images()->count(),
        ]);
    }

    public function deleteImage(int $imageId, User $user): void
    {
        $image = \App\Models\ListingImage::findOrFail($imageId);

        // Verify ownership
        if ($image->listing->user_id !== $user->id && ! $user->isAdmin() && ! $user->isModerator()) {
            throw new RuntimeException('Unauthorized to delete this image.');
        }

        if ($image->public_id) {
            $this->cloudinaryService->delete($image->public_id);
        }

        $image->delete();
    }

    public function search(array $filters): LengthAwarePaginator
    {
        return $this->listingRepo->search($filters);
    }

    private function ensureCanModify(Listing $listing): void
    {
        if (! in_array($listing->status, ['published', 'paused', 'approved'])) {
            throw new RuntimeException('Listing cannot be modified in its current status.');
        }
    }
}
