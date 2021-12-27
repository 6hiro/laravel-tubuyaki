<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

// https://readouble.com/laravel/8.x/ja/eloquent-relationships.html

class Post extends Model
{
    // use HasFactory;

    protected $fillable = [
        'content', 'is_public'
    ];
    // カラムの型を指定
    // protected $casts = [
    //     'is_public' => 'bool'
    // ];

    // $post = Post::find(12));
    // $post->user->name
    // のようにPostモデルを起点に、紐づくUserモデルの各プロパティにアクセスできる
    public function user(): BelongsTo
    {
        return $this->belongsTo('App\Models\User');
    }

    // belongsToManyメソッド
    public function likes(): BelongsToMany
    {
        // 第１引数には関係するモデルのモデル名。
        // 第２引数は中間テーブルのテーブル名。
        // (第２引数を省略すると、中間テーブル名は2つのモデル名の単数形をアルファベット順に
        //  結合した名前であるという前提で処理される。)
        // post_userという中間テーブルが存在するという前提で処理される。
        return $this->belongsToMany('App\Models\User', 'likes')->withTimestamps();
    }

    // $post->isLikedBy(Auth::user())
    // ユーザーがログインしていなければAuth::user()の戻り値はnull
    // ?を付けると、その引数がnullであることも許容される。
    public function isLikedBy(?User $user): bool
    {
        return $user
        // (bool)とは、型キャストと呼ばれるPHPの機能
        // 変数の前に記述し、その変数をかっこ内に指定した型に変換
        // (bool)と記述することで変数を論理値(trueもしくはfalse)に変換
            ? (bool)$this->likes->where('id', $user->id)->count()
            : false;
    }

    // アクセサ(モデルに持たせるget...Attributeという形式の名前のメソッド)
    public function getCountLikesAttribute(): int
    // $post->count_likes で、このメソッドを使う（メソッドの呼び出し時に、()は不要）
    {
        return $this->likes->count();
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\Tag')->withTimestamps();
    }

    public function comments(): HasMany
    // Postと、そのPostのCommentは1対多の関係
    {
        return $this->hasMany('App\Models\Comment')->orderBy('created_at', 'desc');
    }
    public function getCountCommentsAttribute(): int
    // このメソッドを使う時は、$post->count_comments
    {
        return $this->comments->count();
    }
}
