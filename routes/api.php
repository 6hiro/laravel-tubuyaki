<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\PostController;

use App\Http\Resources\UserResource;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
// Route::post('login', 'LoginController@login');
// Route::post('logout', 'LoginController@logout');
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::get('/user', function (Request $request) {
    return response()->json([
        // return new UserResource($user);
        "user"=>new UserResource($request->user())
    ]);
})->name('user');
Route::group(['middleware' => 'auth:sanctum'], function(){
    // User
    Route::get('/user/{id}', 'UserController@show')->name('showUser');
    Route::patch('/user/{user}', 'API\AuthController@updateUserName')->name('updateUserName');
    Route::delete('/user/{user}', 'API\AuthController@destroy')->name('destroyUser');
    Route::put('/user/{id}/follow', 'UserController@followUnfollow')->name('followUnfollow');
    Route::get('/user/{id}/followings', 'UserController@followings')->name('followings');
    Route::get('/user/{id}/followers', 'UserController@followers')->name('followers');
    Route::get('/user/{id}/likes', 'UserController@likesUsers')->name('likesUsers');
    Route::get('/post/user/{id}', 'UserController@userPosts')->name('userPosts');

    // Post
    Route::get('/post', 'PostController@index')->name('postIndex'); 
    Route::get('/post/{id}', 'PostController@show')->name('postShow'); 
    Route::post('/post', 'PostController@store')->name('postStore');
    Route::patch('/post/{post}', 'PostController@update')->name('postUpdate');
    Route::delete('/post/{post}', 'PostController@destroy')->name('postDestroy');
    Route::get('/post/hashtag/{id}', 'PostController@hashtag')->name('hashtag');
    Route::get('/post/user/{id}/like', 'PostController@likedPosts')->name('likedPosts');
    Route::get('/followings/post', 'PostController@followingsPost')->name('followingsPost');
    Route::put('/post/{post}/like', 'PostController@likeUnlike')->name('likeUnlike');
    Route::get('/post/search/{word}', 'PostController@searchPosts')->name('');
    // Post/Comment
    Route::post('/post/comment', 'PostController@addComment')->name('addComment');
    Route::delete('/post/comment/{comment}', 'PostController@destroyComment')->name('destroyComment');

});