<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * POST /api/v1/reports/listing
     * POST /api/v1/reports/profile
     * POST /api/v1/reports/message
     */
    public function store(Request $request, string $type): JsonResponse
    {
        $allowed = ['listing', 'profile', 'message'];
        if (! in_array($type, $allowed)) {
            return response()->json(['success' => false, 'message' => 'Invalid report type.'], 422);
        }

        $data = $request->validate([
            'target_id'   => 'required|integer',
            'reason'      => 'required|string|max:100',
            'description' => 'nullable|string|max:1000',
        ]);

        $report = Report::create([
            'reporter_id' => $request->user()->id,
            'report_type' => $type,
            'target_id'   => $data['target_id'],
            'reason'      => $data['reason'],
            'description' => $data['description'] ?? null,
            'status'      => 'open',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Report submitted. Our team will review it shortly.',
            'data'    => $report,
        ], 201);
    }

    /**
     * GET /api/v1/reports  — Own reports
     */
    public function index(Request $request): JsonResponse
    {
        $reports = Report::where('reporter_id', $request->user()->id)
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $reports->items(),
            'meta'    => ['total' => $reports->total()],
        ]);
    }
}
