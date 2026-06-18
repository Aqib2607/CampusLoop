<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('restrict');
            $table->string('title');
            $table->longText('description');
            $table->decimal('price', 10, 2);
            $table->enum('condition', ['new', 'like_new', 'good', 'fair', 'poor'])->default('good');
            $table->boolean('negotiable')->default(false);
            $table->enum('status', [
                'draft', 'pending', 'approved', 'rejected',
                'published', 'paused', 'sold', 'archived'
            ])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->integer('expiry_days')->default(30);
            $table->timestamp('expiry_date')->nullable();
            $table->timestamp('sold_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('view_count')->default(0);

            // Full-text search index columns
            $table->string('location')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
            $table->index('category_id');
            $table->index('status');
            $table->index('expiry_date');
            $table->index('price');
            $table->index(['category_id', 'status']);
            $table->fullText(['title', 'description']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
