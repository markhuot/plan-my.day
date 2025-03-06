<?php

namespace App\Http\Controllers\OAuth\Connect;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class Google extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $token = app(\Google\Client::class)->fetchAccessTokenWithAuthCode($request->query('code'));

        if ($token['error'] ?? false) {
            throw new \RuntimeException($token['error'] . ': ' . $token['error_description']);
        }

        $model = new \App\Models\OAuthTokenGoogle($token);
        $model->type = get_class($model);
        $model->user_id = auth()->user()->id;
        $model->save();

        return redirect()->route('dashboard');
    }
}
