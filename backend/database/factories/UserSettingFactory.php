<?php

namespace Database\Factories;

use App\Models\UserSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserSettingFactory extends Factory
{
    protected $model = UserSetting::class;

    public function definition(): array
    {
        return [
            'default_expiry_days' => fake()->randomElement([7, 14, 30, 60]),
            'email_notifications' => fake()->boolean(80),
            'push_notifications' => fake()->boolean(70),
            'privacy_mode' => fake()->boolean(20),
        ];
    }
}
