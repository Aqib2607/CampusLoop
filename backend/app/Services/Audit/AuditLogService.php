<?php

namespace App\Services\Audit;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditLogService
{
    public function log(
        string $actionType,
        ?string $tableName = null,
        ?int $recordId = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $description = null,
        ?int $userId = null
    ): AuditLog {
        $userId = $userId ?? Auth::id();

        return AuditLog::create([
            'user_id'     => $userId,
            'action_type' => $actionType,
            'table_name'  => $tableName,
            'record_id'   => $recordId,
            'old_values'  => $oldValues,
            'new_values'  => $newValues,
            'ip_address'  => Request::ip(),
            'user_agent'  => Request::userAgent(),
            'description' => $description,
            'created_at'  => now(),
        ]);
    }

    public function logModelChange(
        string $action,
        string $tableName,
        int $recordId,
        ?array $oldValues,
        ?array $newValues
    ): AuditLog {
        return $this->log($action, $tableName, $recordId, $oldValues, $newValues);
    }
}
