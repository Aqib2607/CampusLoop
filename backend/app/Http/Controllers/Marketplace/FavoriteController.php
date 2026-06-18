<?php

namespace App\Http\Controllers\Marketplace;

use App\Http\Controllers\Controller;
use App\Http\Resources\ListingResource;
use App\Models\Favorite;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * GET /api/v1/favorites
     */
    public function index(Request $request): JsonResponse
    {
        $favorites = Favorite::with(['listing.images', 'listing.category', 'listing.user'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => ListingResource::collection(
                $favorites->getCollection()->map->listing
            ),
            'meta'    => [
                'current_page' => $favorites->currentPage(),
                'per_page'     => $favorites->perPage(),
                'total'        => $favorites->total(),
            ],
        ]);
    }

    /**
     * POST /api/v1/favorites
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'listing_id' => 'required|integer|exists:listings,id',
        ]);

        $favorite = Favorite::firstOrCreate([
            'user_id'    => $request->user()->id,
            'listing_id' => $request->input('listing_id'),
        ]);

        return response()->json([
            'success' => true,
            'message' => $favorite->wasRecentlyCreated ? 'Added to favorites.' : 'Already in favorites.',
            'data'    => $favorite,
        ], $favorite->wasRecentlyCreated ? 201 : 200);
    }

    /**
     * DELETE /api/v1/favorites/{listing_id}
     */
    public function destroy(Request $request, int $listingId): JsonResponse
    {
        $deleted = Favorite::where('user_id', $request->user()->id)
            ->where('listing_id', $listingId)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => $deleted ? 'Removed from favorites.' : 'Not in favorites.',
        ]);
    }
}
