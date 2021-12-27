<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\UserResource;

class LoginController extends Controller
{
    /**
     * 認証の試行を処理
     *  https://readouble.com/laravel/8.x/ja/authentication.html
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return response()->json([
                'user'=>new UserResource(Auth::user()),
                'status'=>200,
            ]);
        }

        return response()->json([
            'status'=>419,
        ], 200);
    }

    /**
     * ユーザーをアプリケーションからログアウトさせる
    *
    * @param  \Illuminate\Http\Request  $request
    * @return \Illuminate\Http\JsonResponse
    */
    public function logout(Request $request)
    {
        Auth::logout();

        // セッションを再作成
        $request->session()->invalidate();

        // CSRFトークンを再作成
        $request->session()->regenerateToken();

        return response()->json(true);
    }
}