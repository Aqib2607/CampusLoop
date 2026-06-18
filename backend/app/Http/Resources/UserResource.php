<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'username'       => $this->username,
            'email'          => $this->email,
            'phone'          => $this->phone,
            'avatar'         => $this->avatar,
            'bio'            => $this->bio,
            'university'     => $this->university,
            'department'     => $this->department,
            'student_id'     => $this->student_id,
            'year_of_study'  => $this->year_of_study,
            'is_verified'    => $this->is_verified,
            'status'         => $this->status,
            'roles'          => $this->whenLoaded('roles', fn () => $this->roles->pluck('name')),
            'settings'       => $this->whenLoaded('settings', fn () => [
                'default_expiry_days' => $this->settings?->default_expiry_days,
                'email_notifications' => $this->settings?->email_notifications,
                'push_notifications'  => $this->settings?->push_notifications,
                'privacy_mode'        => $this->settings?->privacy_mode,
            ]),
            'rating_summary' => $this->whenLoaded('ratingSummary', fn () => [
                'average_rating'      => $this->ratingSummary?->average_rating,
                'review_count'        => $this->ratingSummary?->review_count,
                'positive_percentage' => $this->ratingSummary?->positive_percentage,
            ]),
            'last_seen_at'   => $this->last_seen_at,
            'created_at'     => $this->created_at,
        ];
    }
}
