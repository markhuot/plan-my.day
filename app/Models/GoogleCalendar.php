<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GoogleCalendar extends Model
{
    protected $fillable = [
        'remote_id',
        'name',
    ];
}
