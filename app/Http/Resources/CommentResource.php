<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // return parent::toArray($request);
        return [
            'id' => $this->resource['id'],
            'content' => $this->resource['content'],
            'created_at' => $this->created_at->format('Y/m/d H:i'),
            // '_embedded' => [
                // whenLoadedは ::with()など でリレーションが既にロードされている場合にのみ、
                // リソースレスポンスへリレーションを含める。
                'user' => new UserResource($this->whenLoaded('user')),
                'post' => new PostResource($this->whenLoaded('post')),
            // ]
        ];
    }
}
