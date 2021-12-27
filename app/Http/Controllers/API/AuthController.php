<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{
    //
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'name'=>'required|max:191',
            'email'=>'required|email|max:191|unique:users,email',
            'password'=>'required|min:8',
        ]);

        if($validator->fails())
        {
            return response()->json([
                'status'=>419,
                'validation_errors'=>$validator->messages(),
            ]);
            // "validation_errors": {
            //     "password": [
            //         "The password must be at least 8 characters."
            //     ]
            // }
        }
        else
        {
            $user = User::create([
                'name'=>$request->name,
                'email'=>$request->email,
                'password'=>Hash::make($request->password),
            ]);

            return response()->json([
                'status'=>200,
                'username'=>$user->name,
                'message'=>'Registerd Successfully',
            ]);
        }
    }
    public function updateUserName(Request $request, User $user)
    {
        $validator = Validator::make($request->all(),[
            'name'=>'required|max:191',
        ]);
        if($validator->fails())
        {
            return response()->json([
                'status'=>419,
                'validation_errors'=>$validator->messages(),
            ]);
        }

        if($request->user()->id !== $user->id)
        {
            return response()->json([], 401);
        }
        else
        {
            $user->name = $request->name;
            $user->save();
    
            return $user
                ? response()->json([
                        'userName'=>$user->name,
                    ])
                : response()->json([], 500);
        }

    }
    public function destroy(Request $request, User $user)
    {
        if($request->user()->id !== $user->id)
        {
            return response()->json([], 401);
        }
        else
        {
            return $user->delete()
                ? response()->json($user)
                : response()->json([], 500);
        }     
    }
}
