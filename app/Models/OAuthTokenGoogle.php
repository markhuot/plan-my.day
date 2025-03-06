<?php

namespace App\Models;

use Google\Client;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class OAuthTokenGoogle extends Model
{
    protected $casts = [
        'expires_at' => 'datetime',
    ];

    protected $fillable = [
        'access_token',
        'refresh_token',
        'expires_in',
        'expires_at',
        'token_type',
        'scope',
    ];

    protected $table = 'oauth_tokens';

    protected static function booting()
    {
        static::retrieved(function ($model) {
            if ($model->expires_at->isPast()) {
                $model->refresh();
            }
        });
    }

    public function refresh(): self
    {
        /** @var Client $client */
        $client = app(Client::class);
        $response = $client->refreshToken($this->refresh_token);
        $this->update([
            'access_token' => $response['access_token'],
            'expires_in' => $response['expires_in'],
        ]);

        return $this;
    }

    public function expiresIn(): Attribute
    {
        return Attribute::make(
            set: fn (int $seconds) => [
                'expires_at' => now()->addSeconds($seconds),
            ],
        );
    }
}
