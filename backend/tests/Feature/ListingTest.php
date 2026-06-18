<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListingTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_listing()
    {
        $user = User::factory()->create();
        $user->assignRole('student');
        $category = Category::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/listings', [
            'title'       => 'Used Calculus Textbook',
            'description' => 'Almost new condition, barely used.',
            'price'       => 45.00,
            'category_id' => $category->id,
            'condition'   => 'like_new',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.title', 'Used Calculus Textbook');

        $this->assertDatabaseHas('listings', ['title' => 'Used Calculus Textbook', 'status' => 'pending']);
    }

    public function test_public_can_view_published_listings()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        Listing::factory()->create([
            'user_id'     => $user->id,
            'category_id' => $category->id,
            'status'      => 'published',
            'title'       => 'Public Listing',
        ]);

        $response = $this->getJson('/api/v1/listings');

        $response->assertStatus(200)
                 ->assertJsonFragment(['title' => 'Public Listing']);
    }
}
