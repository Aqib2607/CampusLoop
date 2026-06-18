<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('api-keys:reset-requests')]
#[Description('Reset the daily request count for all API keys')]
class ResetApiKeyRequestsCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = \App\Models\ApiKey::query()->update(['requests_today' => 0]);
        $this->info("Reset requests_today for {$count} API keys.");
        \Illuminate\Support\Facades\Log::info("Reset requests_today for {$count} API keys via scheduled command.");
    }
}
