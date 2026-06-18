<?php

use App\Models\AiProvider;
use App\Models\ApiKey;
use App\Models\User;
use App\Services\AI\ApiKeyRotationService;
use App\Services\AI\Providers\AbstractAIProvider;
use function Pest\Laravel\actingAs;

test('api keys can be rotated by admin', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $provider = AiProvider::factory()->create(['provider_name' => 'gemini']);
    $key = ApiKey::factory()->create([
        'provider_id' => $provider->id,
        'status' => false
    ]);

    // Assuming the endpoint for updating API keys accepts `status`
    actingAs($admin)->putJson("/api/v1/api-keys/{$key->id}", [
        'status' => true
    ])->assertOk()
      ->assertJsonPath('data.status', true);
});

test('moderators cannot rotate api keys', function () {
    /** @var \App\Models\User $moderator */
    $moderator = User::factory()->create();
    $moderator->assignRole('moderator');

    $provider = AiProvider::factory()->create(['provider_name' => 'gemini']);
    $key = ApiKey::factory()->create([
        'provider_id' => $provider->id,
        'status' => false
    ]);

    actingAs($moderator)->putJson("/api/v1/api-keys/{$key->id}", [
        'status' => true
    ])->assertForbidden();
});

test('ApiKeyRotationService executes with the first available key', function () {
    $provider = AiProvider::factory()->create(['provider_name' => 'gemini']);
    
    // Inactive key
    ApiKey::factory()->create([
        'provider_id' => $provider->id,
        'status' => false,
        'priority' => 1
    ]);

    // Active key
    $activeKey = ApiKey::factory()->create([
        'provider_id' => $provider->id,
        'status' => true,
        'priority' => 2,
        'api_key' => 'valid-key'
    ]);

    $service = app(ApiKeyRotationService::class);
    
    $result = $service->executeWithRotation($provider, function (AbstractAIProvider $driver) use ($activeKey) {
        // Assert the driver is using the active key
        expect($driver->getApiKey()->id)->toBe($activeKey->id);
        return ['success' => true];
    });

    expect($result['success'])->toBeTrue();
});
