<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Google\Client;
use Google\Service\Calendar;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(Client::class, function () {
            $client = new Client();
            $client->setAuthConfig(config('services.google.credentials'));
            $client->addScope(Calendar::CALENDAR_READONLY);
            $client->setAccessType('offline');
            $client->setPrompt('consent');
            $client->setRedirectUri(url('/oauth/connect/google'));

            return $client;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::preventLazyLoading();
        Date::use(CarbonImmutable::class);
    }
}
