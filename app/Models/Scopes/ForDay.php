<?php

namespace App\Models\Scopes;

use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;

trait ForDay
{
    public function scopeForDay(Builder $builder, string|Carbon|CarbonImmutable $day)
    {
        if ($day instanceof Carbon || $day instanceof CarbonImmutable) {
            $day = $day->format('Y-m-d');
        }

        return $builder->where('day', $day);
    }

    public function scopeBetweenDays(Builder $builder, int $fromDaysAgo, int $toDaysAgo = -1)
    {
        return $builder->whereBetween('day', [
            now()->addDays($fromDaysAgo)->format('Y-m-d'),
            now()->addDays($toDaysAgo)->format('Y-m-d'),
        ]);
    }
}
