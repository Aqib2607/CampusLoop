<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('moderation_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('moderator_id')->constrained('users')->onDelete('cascade');
            $table->string('target_type'); // listing, user, report, message
            $table->unsignedBigInteger('target_id');
            $table->enum('action_type', ['warning', 'hide', 'suspend', 'ban', 'approve', 'reject', 'restore', 'dismiss']);
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable(); // Additional context
            $table->timestamps();

            $table->index('moderator_id');
            $table->index(['target_type', 'target_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('moderation_actions');
    }
};
