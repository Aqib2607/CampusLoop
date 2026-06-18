<?php

namespace App\Http\Controllers\AI;

use App\Http\Controllers\Controller;
use App\Models\AiProvider;
use App\Models\ApiKey;
use App\Services\Audit\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class AiProviderController extends Controller
{
    /**
     * GET /api/v1/admin/ai/providers
     */
    public function index(): JsonResponse
    {
        $providers = AiProvider::withCount('apiKeys')->get();

        return response()->json(['success' => true, 'data' => $providers]);
    }

    /**
     * POST /api/v1/admin/ai/providers
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'provider_name' => 'required|string|in:openai,gemini,groq,claude|unique:ai_providers,provider_name',
            'display_name'  => 'required|string|max:100',
            'description'   => 'nullable|string|max:500',
        ]);

        $provider = AiProvider::create($data);

        return response()->json(['success' => true, 'message' => 'Provider added.', 'data' => $provider], 201);
    }

    /**
     * PUT /api/v1/admin/ai/providers/{id}
     */
    public function update(Request $request, AiProvider $aiProvider): JsonResponse
    {
        $data = $request->validate([
            'display_name' => 'sometimes|string|max:100',
            'status'       => 'sometimes|boolean',
            'description'  => 'nullable|string|max:500',
        ]);

        $aiProvider->update($data);

        return response()->json(['success' => true, 'message' => 'Provider updated.', 'data' => $aiProvider->fresh()]);
    }

    /**
     * DELETE /api/v1/admin/ai/providers/{id}  [Admin only]
     */
    public function destroy(AiProvider $aiProvider, AuditLogService $audit): JsonResponse
    {
        $audit->log('delete_ai_provider', 'ai_providers', $aiProvider->id, $aiProvider->toArray());
        $aiProvider->delete();

        return response()->json(['success' => true, 'message' => 'Provider deleted.']);
    }
}
