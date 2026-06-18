<?php

namespace App\Policies;

use App\Models\Listing;
use App\Models\User;

class ListingPolicy
{
    public function update(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id
            || $user->isAdmin()
            || $user->isModerator();
    }

    public function delete(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id
            || $user->isAdmin();
    }

    public function approve(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }
}
