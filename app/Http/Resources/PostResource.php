<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public static $wrap = '';

    public function toArray($request)
    {
        // return parent::toArray($request);
        return [
            'id' => $this->resource['id'],
            'content' => $this->resource['content'],
            'is_public' => $this->is_public,
            'created_at' => $this->created_at->format('Y/m/d H:i'),
            // '_embedded' => [
                // whenLoadedは ::with()など でリレーションが既にロードされている場合にのみ、
                // リソースレスポンスへリレーションを含める。
                'user' => new UserResource($this->whenLoaded('user')),
                'count_likes' => $this->count_likes,
                'is_liked' => $this->isLikedBy(Auth::user()),
                'tags' => TagResource::collection($this->whenLoaded('tags')),
                'comments' => CommentResource::collection($this->whenLoaded('comments')),
                'count_comments' => $this->count_comments,    
            // ]
        ];
    }
}
