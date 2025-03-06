<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Jobs\SyncGoogleCalendarEventsForUserForDay;
use App\Jobs\SyncGoogleCalendarsForUser;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function todos(): HasMany
    {
        return $this->hasMany(Todo::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    public function syncCalendars(): void
    {
        if ($this->oauthTokens->isEmpty()) {
            return;
        }

        dispatch(new SyncGoogleCalendarsForUser($this->id));
    }

    public function syncEvents(CarbonImmutable|string $day, bool $now=false): void
    {
        if ($day instanceof CarbonImmutable) {
            $day = $day->format('Y-m-d');
        }

        if ($this->oauthTokens->isEmpty()) {
            return;
        }

        $job = new SyncGoogleCalendarEventsForUserForDay($this->id, $day);

        if ($now) {
            dispatch_sync($job);
        }
        else {
            dispatch($job);
        }
    }

    public function oauthTokens(): HasMany
    {
        return $this->hasMany(OAuthTokenGoogle::class);
    }

    public function googleCalendars(): HasMany
    {
        return $this->hasMany(GoogleCalendar::class);
    }
}
