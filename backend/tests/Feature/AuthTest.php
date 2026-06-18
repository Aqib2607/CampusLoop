<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register()
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name'                  => 'John Doe',
            'email'                 => 'johndoe@example.com',
            'password'              => 'Password123!',
            'password_confirmation' => 'Password123!',
            'username'              => 'johndoe',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['success', 'message', 'data' => ['user', 'token']]);

        $this->assertDatabaseHas('users', ['email' => 'johndoe@example.com']);
    }

    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'email'    => 'johndoe@example.com',
            'password' => bcrypt('Password123!'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email'    => 'johndoe@example.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['success', 'message', 'data' => ['user', 'token']]);
    }
}
