<?php

namespace App\Http\Controllers\Marketplace;

use App\Http\Controllers\Controller;
use App\Http\Requests\Marketplace\CreateListingRequest;
use App\Http\Requests\Marketplace\UpdateListingRequest;
use App\Http\Resources\ListingResource;
use App\Models\Listing;
use App\Services\Marketplace\ListingService;
use App\Services\Moderation\ModerationAIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    public function __construct(
        private readonly ListingService $listingService,
        private readonly ModerationAIService $aiService
    ) {}

    /**
     * GET /api/v1/listings
     */
    public function index(Request $request): JsonResponse
    {
        $listings = $this->listingService->search($request->all());

        return response()->json([
            'success' => true,
            'data'    => ListingResource::collection($listings->items()),
            'meta'    => [
                'current_page' => $listings->currentPage(),
                'per_page'     => $listings->perPage(),
                'total'        => $listings->total(),
                'last_page'    => $listings->lastPage(),
            ],
        ]);
    }

    /**
     * POST /api/v1/listings
     */
    public function store(CreateListingRequest $request): JsonResponse
    {
        $listing = $this->listingService->create(
            $request->user(),
            $request->validated(),
            $request->file('images', [])
        );

        // Trigger AI moderation and notifications asynchronously
        event(new \App\Events\ListingCreated($listing));

        return response()->json([
            'success' => true,
            'message' => 'Listing created and submitted for review.',
            'data'    => new ListingResource($listing->load(['images', 'category', 'user'])),
        ], 201);
    }

    /**
     * GET /api/v1/listings/{id}
     */
    public function show(Request $request, Listing $listing): JsonResponse
    {
        // Track view
        $listing->views()->create([
            'viewer_id'  => $request->user()?->id,
            'ip_address' => $request->ip(),
            'viewed_at'  => now(),
        ]);
        $listing->increment('view_count');

        return response()->json([
            'success' => true,
            'data'    => new ListingResource(
                $listing->load(['images', 'category', 'user.ratingSummary', 'latestAiModerationLog'])
            ),
        ]);
    }

    /**
     * PUT /api/v1/listings/{id}
     */
    public function update(UpdateListingRequest $request, Listing $listing): JsonResponse
    {
        $this->authorize('update', $listing);

        $listing = $this->listingService->update($listing, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Listing updated.',
            'data'    => new ListingResource($listing),
        ]);
    }

    /**
     * DELETE /api/v1/listings/{id}
     */
    public function destroy(Request $request, Listing $listing): JsonResponse
    {
        $this->authorize('delete', $listing);

        $this->listingService->delete($listing);

        return response()->json([
            'success' => true,
            'message' => 'Listing deleted.',
        ]);
    }

    /**
     * POST /api/v1/listings/{id}/pause
     */
    public function pause(Request $request, Listing $listing): JsonResponse
    {
        $this->authorize('update', $listing);

        $listing = $this->listingService->pause($listing);

        return response()->json([
            'success' => true,
            'message' => 'Listing paused.',
            'data'    => new ListingResource($listing),
        ]);
    }

    /**
     * POST /api/v1/listings/{id}/resume
     */
    public function resume(Request $request, Listing $listing): JsonResponse
    {
        $this->authorize('update', $listing);

        $listing = $this->listingService->resume($listing);

        return response()->json([
            'success' => true,
            'message' => 'Listing resumed.',
            'data'    => new ListingResource($listing),
        ]);
    }

    /**
     * POST /api/v1/listings/{id}/sold
     */
    public function markSold(Request $request, Listing $listing): JsonResponse
    {
        $this->authorize('update', $listing);

        $listing = $this->listingService->markSold($listing);

        return response()->json([
            'success' => true,
            'message' => 'Listing marked as sold.',
            'data'    => new ListingResource($listing),
        ]);
    }

    /**
     * POST /api/v1/listings/{id}/renew
     */
    public function renew(Request $request, Listing $listing): JsonResponse
    {
        $this->authorize('update', $listing);

        $days    = $request->input('expiry_days', 30);
        $listing = $this->listingService->renew($listing, $days);

        return response()->json([
            'success' => true,
            'message' => 'Listing renewed.',
            'data'    => new ListingResource($listing),
        ]);
    }

    /**
     * POST /api/v1/listings/{id}/images
     */
    public function uploadImages(Request $request, Listing $listing): JsonResponse
    {
        $this->authorize('update', $listing);

        $request->validate([
            'images'   => 'required|array|max:10',
            'images.*' => 'required|image|mimes:jpg,jpeg,png,webp|max:20480',
        ]);

        foreach ($request->file('images') as $image) {
            $this->listingService->uploadListingImage($listing, $image);
        }

        return response()->json([
            'success' => true,
            'message' => 'Images uploaded.',
            'data'    => new ListingResource($listing->load('images')),
        ]);
    }

    /**
     * DELETE /api/v1/listing-images/{id}
     */
    public function deleteImage(Request $request, int $imageId): JsonResponse
    {
        $this->listingService->deleteImage($imageId, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Image deleted.',
        ]);
    }

    /**
     * GET /api/v1/my-listings
     */
    public function myListings(Request $request): JsonResponse
    {
        $repo     = app(\App\Repositories\ListingRepository::class);
        $items    = $repo->getByUser($request->user()->id);

        return response()->json([
            'success' => true,
            'data'    => ListingResource::collection($items),
        ]);
    }
}
