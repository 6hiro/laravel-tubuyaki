<?php
declare(strict_types=1);
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::post('/login', 'LoginController@login');
Route::post('/logout', 'LoginController@logout');

Route::get('/', function () {
    return view('index');
});
// auth
Route::get('/auth/register', function () {
    return view('index');
});
Route::get('/auth/login', function () {
    return view('index');
});
Route::get('/settings', function () {
    return view('index');
});
// profile
Route::get('/prof/{id}', function () {
    return view('index');
});
// post
Route::get('/post', function () {
    return view('index');
});
Route::get('/post/add', function () {
    return view('index');
});
Route::get('/post/list', function () {
    return view('index');
});
Route::get('/post/{id}', function () {
    return view('index');
});
Route::get('/post/hashtag/{id}', function () {
    return view('index');
});
Route::get('/post/user/{id}/like', function () {
    return view('index');
});
Route::get('/post/user/{id}', function () {
    return view('index');
});
Route::get('/search/{word}', function () {
    return view('index');
});