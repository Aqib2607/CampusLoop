<?php

namespace App\Http\Controllers\AI;

use App\Http\Controllers\Controller;
use App\Models\ApiKey;
use App\Models\ApiKeyLog;
use App\Services\Audit\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApiKeyController extends Controller
{
    /**
     * GET /api/v1/admin/api-keys
     */
    public function index(Request $request): JsonResponse
    {
        $keys = ApiKey::with('provider')
            ->when($request->input('provider_id'), fn ($q, $id) => $q->where('provider_id', $id))
            ->withoutTrashed()
            ->orderBy('provider_id')
            ->orderBy('priority')
            ->get()
            ->map(fn ($key) => [
                'id'              => $key->id,
                'provider'        => $key->provider->display_name,
                'provider_id'     => $key->provider_id,
                'key_name'        => $key->key_name,
                'priority'        => $key->priority,
                'status'          => $key->status,
                'requests_today'  => $key->requests_today,
                'success_count'   => $key->success_count,
                'failure_count'   => $key->failure_count,
                'last_used_at'    => $key->last_used_at,
                'disabled_until'  => $key->disabled_until,
                'created_at'      => $key->created_at,
                // Never expose encrypted_key
            ]);

        return response()->json(['success' => true, 'data' => $keys]);
    }

    /**
     * POST /api/v1/admin/api-keys
     */
    public function store(Request $request, AuditLogService $audit): JsonResponse
    {
        $data = $request->validate([
            'provider_id' => 'required|integer|exists:ai_providers,id',
            'key_name'    => 'required|string|max:100',
            'api_key'     => 'required|string|min:10', // The raw API key
            'priority'    => 'nullable|integer|min:1|max:100',
        ]);

        $apiKey              = new ApiKey();
        $apiKey->provider_id = $data['provider_id'];
        $apiKey->key_name    = $data['key_name'];
        $apiKey->priority    = $data['priority'] ?? 1;
        $apiKey->created_by  = $request->user()->id;

        // Encrypt the key before saving
        $apiKey->setRawKeyAttribute($data['api_key']);
        $apiKey->save();

        $audit->log('create_api_key', 'api_keys', $apiKey->id, null, [
            'provider_id' => $apiKey->provider_id,
            'key_name'    => $apiKey->key_name,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'API key added and encrypted.',
            'data'    => $apiKey->only(['id', 'provider_id', 'key_name', 'priority', 'status', 'created_at']),
        ], 201);
    }

    /**
     * PUT /api/v1/admin/api-keys/{id} — Enable/Disable
     */
    public function update(Request $request, ApiKey $apiKey, AuditLogService $audit): JsonResponse
    {
        $data = $request->validate([
            'status'   => 'sometimes|boolean',
            'priority' => 'sometimes|integer|min:1|max:100',
            'key_name' => 'sometimes|string|max:100',
        ]);

        $old = $apiKey->only(['status', 'priority', 'key_name']);
        $apiKey->update($data);

        $audit->log('update_api_key', 'api_keys', $apiKey->id, $old, $data);

        return response()->json([
            'success' => true,
            'message' => 'API key updated.',
            'data'    => $apiKey->only(['id', 'key_name', 'status', 'priority', 'updated_at']),
        ]);
    }

    /**
     * DELETE /api/v1/admin/api-keys/{id}  [Admin only]
     */
    public function destroy(ApiKey $apiKey, AuditLogService $audit): JsonResponse
    {
        $audit->log('delete_api_key', 'api_keys', $apiKey->id, $apiKey->only(['key_name', 'provider_id']));
        $apiKey->delete();

        return response()->json(['success' => true, 'message' => 'API key deleted.']);
    }

    /**
     * GET /api/v1/admin/api-keys/{id}/logs
     */
    public function logs(ApiKey $apiKey): JsonResponse
    {
        $logs = ApiKeyLog::where('api_key_id', $apiKey->id)
            ->latest()
            ->paginate(50);

        return response()->json([
            'success' => true,
            'data'    => $logs->items(),
            'meta'    => ['total' => $logs->total()],
        ]);
    }
}
