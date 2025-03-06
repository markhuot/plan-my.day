<?php

namespace App\Jobs;

use App\Models\OAuthTokenGoogle;
use App\Models\User;
use Google\Client;
use Google\Service\Calendar;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SyncGoogleCalendarsForUser implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $userId,
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        /** @var User $user */
        $user = User::findOrFail($this->userId);
        $token = $user->oauthTokens()
            ->where('type', OAuthTokenGoogle::class)
            ->firstOrFail();

        /** @var Client $client */
        $client = app(Client::class);
        $client->setAccessToken($token->access_token);

        $service = new Calendar($client);
        $calendars = $service->calendarList->listCalendarList();

        foreach ($calendars->getItems() as $calendar) {
            $user->googleCalendars()->updateOrCreate([
                'remote_id' => $calendar->getId(),
            ], [
                'name' => $calendar->getSummary(),
            ]);
        }
    }
}
