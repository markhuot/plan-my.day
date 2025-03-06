<?php

namespace App\Jobs;

use App\Models\DeadLetterTodo;
use App\Models\OAuthTokenGoogle;
use App\Models\User;
use Carbon\CarbonImmutable;
use Google\Client;
use Google\Service\Calendar;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Middleware\WithoutOverlapping;

class SyncGoogleCalendarEventsForUserForDay implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $userId,
        public string $day,
    ) {
    }

//    public function middleware(): array
//    {
//        return [
//            (new WithoutOverlapping(implode(':', [
//                $this->userId,
//                $this->day,
//            ])))->releaseAfter(120),
//        ];
//    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $user = User::findOrfail($this->userId);
        $token = $user->oauthTokens()->where('type', OAuthTokenGoogle::class)->firstOrFail();

        /** @var Client $client */
        $client = app(Client::class);
        $client->setAccessToken($token->access_token);

        $service = new Calendar($client);

        foreach ($user->googleCalendars()->where('enabled', '=', true)->get() as $calendar) {
            $events = collect($service->events->listEvents($calendar->remote_id, [
                'timeMin' => $this->day.'T00:00:00Z',
                'timeMax' => $this->day.'T23:59:59Z',
                'singleEvents' => true,
                'orderBy' => 'startTime',
            ])->getItems());

            $deadRemoteIds = DeadLetterTodo::query()
                ->where('user_id', '=', $user->id)
                ->whereIn('remote_id', $events->pluck('id'))
                ->pluck('remote_id');

            foreach ($events->filter(fn ($event) => $deadRemoteIds->doesntContain($event->getId())) as $event) {
                $start = CarbonImmutable::create($event->getStart()->getDateTime());
                $time = $start->format('g');
                if ($start->minute !== 0) {
                    $time .= ':'.$start->format('i');
                }
                $time .= $start->format('a');

                $user->todos()->updateOrCreate([
                    'remote_id' => $event->getId(),
                    'day' => $this->day,
                ], [
                    'title' => $time . ' ' . ($event->getSummary() ?? ' Private Event'),
                ]);
            }
        }
    }
}
