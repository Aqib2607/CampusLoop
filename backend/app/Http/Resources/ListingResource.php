<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'title'             => $this->title,
            'description'       => $this->description,
            'price'             => $this->price,
            'condition'         => $this->condition,
            'negotiable'        => $this->negotiable,
            'status'            => $this->status,
            'rejection_reason'  => $this->when(
                $this->status === 'rejected',
                $this->rejection_reason
            ),
            'expiry_days'       => $this->expiry_days,
            'expiry_date'       => $this->expiry_date,
            'sold_at'           => $this->sold_at,
            'published_at'      => $this->published_at,
            'view_count'        => $this->view_count,
            'location'          => $this->location,
            'category'          => $this->whenLoaded('category', fn () => [
                'id'   => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),
            'user'              => $this->whenLoaded('user', fn () => [
                'id'     => $this->user->id,
                'name'   => $this->user->name,
                'avatar' => $this->user->avatar,
            ]),
            'images'            => $this->whenLoaded('images', fn () =>
                $this->images->map(fn ($img) => [
                    'id'            => $img->id,
                    'url'           => $img->image_url,
                    'display_order' => $img->display_order,
                ])
            ),
            'ai_moderation'     => $this->whenLoaded('latestAiModerationLog', fn () =>
                $this->latestAiModerationLog ? [
                    'risk_level' => $this->latestAiModerationLog->risk_level,
                    'risk_score' => $this->latestAiModerationLog->risk_score,
                    'result'     => $this->latestAiModerationLog->result,
                    'summary'    => $this->latestAiModerationLog->summary,
                ] : null
            ),
            'created_at'        => $this->created_at,
            'updated_at'        => $this->updated_at,
        ];
    }
}
