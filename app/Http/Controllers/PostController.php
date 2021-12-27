<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Post;
use App\Models\Tag;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;
use App\Http\Resources\PostResource;
use App\Http\Resources\TagResource;
use App\Http\Resources\CommentResource;
use Illuminate\Support\Facades\Auth;

use Illuminate\Database\Eloquent\Builder;

class PostController extends Controller
{
    public function index(Request $request)
    {
        // https://readouble.com/laravel/8.x/ja/eloquent.html#retrieving-models
        // https://readouble.com/laravel/8.x/ja/collections.html
        $user_id = $request->user()->id;
        $posts = Post::with(['tags', 'user'])
            ->whereHas('user', function($q) use ($user_id){
                $q->where('user_id', $user_id)
                ->orWhere('is_public', true);
            })
            ->orderByDesc('created_at')
            ->paginate(10);
        return PostResource::collection($posts);
    }

    public function show(Request $request, string $id){
        // 個別のデータ
        $user_id = $request->user()->id;
        $post = Post::with(['tags', 'user', 'comments', 'comments.user'])
        ->whereHas('user', function($q) use ($user_id){
            $q->where('user_id', $user_id)
            ->orWhere('is_public', true);
        })
        ->find($id);
        return response()->json([
            'post'=>new PostResource($post),
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'content'=>'required|max:250',
            'is_public'=>'required',
        ]);

        if($validator->fails())
        {
            return response()->json([
                'status'=>419,
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $post = new Post;
            $post->content = $request->content;
            $post->is_public = $request->is_public;
            $post->user_id = $request->user()->id;
            $post->save();

            //　contentを空白で分割し、リスト化
            $sentence_list = preg_split('/[\p{Z}\p{Cc}]++/u', $request->content, -1, PREG_SPLIT_NO_EMPTY);

            foreach ($sentence_list as $sentence) {
                // 1文字目が「#」であれば、以下の処理をする。
                // substr($tagName, 1) は、「#」以外の文字列
                if (substr($sentence, 0, 1) === "#") {
                    // firstOrCreateメソッドで、既にtagがテーブルに存在していれば、そのモデルを返し、
                    // テーブルに存在しなければ、そのレコードをテーブルに保存した上で、モデルを返す。
                    $tag = Tag::firstOrCreate(['name' => substr($sentence, 1)]);
                    $post->tags()->attach($tag);
                }
            }

            return $post
            ? response()->json([
                'post'=>$post,
                'tags'=>$post->tags
            ], 201)
            : response()->json([], 500);
        }
    }

    public function update(Request $request, Post $post)
    {
        // is_publicだけ変更できる
        if($request->user()->id !== $post->user_id)
        {
            return response()->json([], 401);
        }
        else
        {
            $post->is_public = $request->is_public;
            $post->save();
    
            return $post
                ? response()->json(['post'=>new PostResource($post)])
                : response()->json([], 500);
        }

    }

    public function destroy(Request $request, Post $post)
    {
        if($request->user()->id !== $post->user_id)
        {
            return response()->json([], 401);
        }
        else
        {
            return $post->delete()
                ? response()->json($post)
                : response()->json([], 500);
        }     
    }
    public function hashtag(Request $request, string $id)
    {
        $user_id = $request->user()->id;
        $posts = Post::with(['tags', 'user'])
            ->whereHas('user', function($q) use ($user_id){
                $q->where('user_id', $user_id)
                ->orWhere('is_public', true);
            })
            // ->orWhere('is_public', true)
            ->whereHas('tags', function($query) use ($id)  {
                $query->where('post_tag.tag_id', (int)$id);
            })
            ->orderByDesc('created_at')->paginate(10);
    
        return PostResource::collection($posts);
    }
    public function likedPosts(Request $request, string $id)
    {
        $user_id = $request->user()->id;
        $posts = Post::with(['tags', 'user'])
            ->whereHas('user', function($q) use ($user_id){
                $q->where('user_id', $user_id)
                ->orWhere('is_public', true);
            })
            // ->orWhere('is_public', true)
            ->whereHas('likes', function($query) use ($id)  {
                $query->where('likes.user_id', (int)$id);
            })
            ->orderByDesc('created_at')->paginate(10);
        
        return PostResource::collection($posts);
    }
    public function followingsPost(Request $request)
    {
        $posts = Post::with(['tags', 'user'])
            ->whereIn('user_id', Auth::user()->followings()->pluck('followee_id'))
            ->Where('is_public', true)
            ->orWhere('user_id', Auth::user()->id)
            ->orderByDesc('created_at')->paginate(10);

        return PostResource::collection($posts);
    }
    public function likeUnlike(Request $request, Post $post)
    {
        if($post->isLikedBy(Auth::user()))
        {
            // $post->likesとすると、記事モデルからlikesテーブル経由で紐付いているユーザーモデルのコレクションが返る。
            // $post->likes()としており、多対多のリレーション(BelongsToManyクラスのインスタンス)が返る。
            // この多対多のリレーションでは、attachメソッドとdetachメソッドが使用できる。
            $post->likes()->detach($request->user()->id);
            return [
                'id' => $post->id,
                'count_likes' => $post->count_likes-1,
                'result' => 'unlike'
            ];
        }
        else
        {
            $post->likes()->detach($request->user()->id);
            // このPostモデルと、リクエストを送信したユーザーのユーザーモデルの両者を
            // 紐づけるlikesテーブルのレコードが新規登録されます。
            // detachメソッドであれば、逆に削除されます。
            // なぜ、必ず削除(detach)してから新規登録(attach)しているかというと、
            // 1人のユーザーが同一記事に複数回重ねていいねを付けられないようにするための考慮です。
            // https://readouble.com/laravel/8.x/ja/eloquent-relationships.html#updating-many-to-many-relationships
            $post->likes()->attach($request->user()->id);
            return [
                'id' => $post->id,
                'count_likes' => $post->count_likes+1,
                'result' => 'like'
            ];
        }

    }
    public function searchPosts(Request $request, string $word)
    {
        $posts = Post::where('content', 'like', "%{$word}%")
            // ->get();
            ->with(['tags', 'user'])
            ->orderByDesc('created_at')->paginate(10);
        return PostResource::collection($posts);
    }
    public function addComment(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'content'=>'required|max:250',
            'post_id'=>'required',
        ]);

        if($validator->fails())
        {
            return response()->json([
                'status'=>419,
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $comment = new Comment;
            $comment->content = $request->content;
            $comment->user_id = $request->user()->id;
            $comment->post_id = $request->post_id;
            $comment->save();

            $comment_ = Comment::with(['user', 'post'])->find($comment->id);

            return $comment_
            ? response()->json([
                'comment'=>new CommentResource($comment_),
            ], 201)
            : response()->json([], 500);
        }
    }
    public function destroyComment(Request $request, Comment $comment)
    {
        if($request->user()->id !== $comment->user_id)
        {
            return response()->json([], 401);
        }
        else
        {
            return $comment->delete()
                ? response()->json($comment)
                : response()->json([], 500);
        }     
    }
}
