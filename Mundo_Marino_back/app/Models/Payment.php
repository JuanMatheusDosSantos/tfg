<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'park_id',
        'date',
        'amount',
        'method',
        'state',
        'reference',
    ];

    function user()
    {
        return $this->belongsTo(User::class);
    }
    function attraction()
    {
        return $this->belongsTo(Attraction::class);
    }
}
