<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles & Permissions
        $this->call([
            RoleSeeder::class,
            PermissionSeeder::class,
        ]);

        // 2. Users & Settings
        $this->call([
            AdminSeeder::class,
            ModeratorSeeder::class,
            UserSeeder::class,
            UserSettingsSeeder::class,
        ]);

        // 3. Marketplace Core
        $this->call([
            CategorySeeder::class,
            ListingSeeder::class,
            ListingImageSeeder::class,
            FavoriteSeeder::class,
        ]);

        // 4. Messaging
        $this->call([
            ConversationSeeder::class,
            MessageSeeder::class,
            AttachmentSeeder::class,
        ]);

        // 5. Engagement & Moderation
        $this->call([
            ReviewSeeder::class,
            RatingSummarySeeder::class,
            ReportSeeder::class,
            ModerationSeeder::class,
        ]);

        // 6. System & Infrastructure
        $this->call([
            NotificationSeeder::class,
            AnalyticsSeeder::class,
            AIProviderSeeder::class,
            APIKeySeeder::class,
            AIModerationSeeder::class,
            AuditLogSeeder::class,
        ]);
    }
}
