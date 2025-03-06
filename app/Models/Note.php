<?php

namespace App\Models;

use App\Casts\Day;
use App\Models\Scopes\ForDay;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use ForDay;

    protected $fillable = [
        'date',
        'contents',
    ];

    protected $casts = [
        'day' => Day::class,
    ];
}
