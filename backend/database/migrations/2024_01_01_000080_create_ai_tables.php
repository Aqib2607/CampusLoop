<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_providers', function (Blueprint $table) {
            $table->id();
            $table->string('provider_name', 50)->unique(); // openai, gemini, groq, claude
            $table->string('display_name', 100);
            $table->boolean('status')->default(true);
            $table->text('description')->nullable();
            $table->json('config')->nullable(); // Additional config per provider
            $table->timestamps();
        });

        Schema::create('api_keys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained('ai_providers')->onDelete('cascade');
            $table->string('key_name');
            $table->text('encrypted_key'); // Always encrypted with Crypt::encryptString()
            $table->unsignedInteger('priority')->default(1); // Lower = higher priority
            $table->boolean('status')->default(true);
            $table->unsignedInteger('requests_today')->default(0);
            $table->unsignedInteger('success_count')->default(0);
            $table->unsignedInteger('failure_count')->default(0);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('disabled_until')->nullable(); // Temporary disable on rate limit
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            $table->index('provider_id');
            $table->index('priority');
            $table->index('status');
            $table->index(['provider_id', 'status', 'priority']);
        });

        Schema::create('api_key_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('api_key_id')->constrained()->onDelete('cascade');
            $table->string('request_type', 100)->nullable(); // moderation, completion, etc.
            $table->string('response_status', 20); // success, failure, rate_limited, timeout
            $table->string('error_code', 50)->nullable();
            $table->text('error_message')->nullable();
            $table->unsignedInteger('tokens_used')->nullable();
            $table->unsignedInteger('response_time_ms')->nullable();
            $table->timestamps();

            $table->index('api_key_id');
            $table->index('response_status');
        });

        Schema::create('ai_moderation_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->onDelete('cascade');
            $table->foreignId('provider_id')->constrained('ai_providers')->onDelete('cascade');
            $table->foreignId('api_key_id')->nullable()->constrained()->onDelete('set null');
            $table->decimal('risk_score', 4, 2)->default(0); // 0.00 - 1.00
            $table->enum('risk_level', ['low', 'medium', 'high', 'critical'])->default('low');
            $table->string('result', 50)->nullable(); // clean, flagged, spam, duplicate, toxic, scam
            $table->json('response_data')->nullable(); // Full AI response
            $table->text('summary')->nullable();
            $table->timestamps();

            $table->index('listing_id');
            $table->index('risk_level');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_moderation_logs');
        Schema::dropIfExists('api_key_logs');
        Schema::dropIfExists('api_keys');
        Schema::dropIfExists('ai_providers');
    }
};
