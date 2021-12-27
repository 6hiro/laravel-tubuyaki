<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Post;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Http\Resources\PostResource;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function show(string $id)
    {
        $user = User::where('id', $id)->first();
        return new UserResource($user);
    }
    public function userPosts(Request $request, int $id)
    {
        if ($id === $request->user()->id)
        {
            $posts = Post::with(['tags', 'user'])
                ->whereHas('user', function($q) use ($id){
                    $q->where('user_id', $id);
                })
                ->orderByDesc('created_at')
                ->paginate(10);
        }
        else
        {
            $posts = Post::with(['tags', 'user'])
                ->whereHas('user', function($q) use ($id){
                    $q->where('user_id', $id);
                })
                ->Where('is_public', true)
                ->orderByDesc('created_at')
                ->paginate(10);
        }

        return PostResource::collection($posts);
    }
    public function likesUsers(string $id)
    {
        $post = Post::where('id', $id)->first();
        $likes = $post->likes->sortByDesc('created_at');
        return UserResource::collection($likes);
    }
    
    public function followings(string $id)
    {
        $user = User::where('id', $id)->first();

        $followings = $user->followings->sortByDesc('created_at');
        return UserResource::collection($followings);
    }
    
    public function followers(string $id)
    {
        $user = User::where('id', $id)->first();

        $followers = $user->followers->sortByDesc('created_at');
        return UserResource::collection($followers);
    }
    public function followUnfollow(Request $request, string $id)
    {
        $user = User::where('id', $id)->first();
        if ($user->id === $request->user()->id)
        {
            return abort('404', 'Cannot follow yourself.');
        }
        if($user->isFollowedBy(Auth::user()))
        {
            $request->user()->followings()->detach($user);
            return [
                'count_followers' => $user->count_followers-1,
                'result' => 'unfollow'
            ];
        }
        else
        {
            $request->user()->followings()->detach($user);
            $request->user()->followings()->attach($user);
            return [
                'count_followers' => $user->count_followers+1,
                'result' => 'follow'
            ];
        }
    }
}
