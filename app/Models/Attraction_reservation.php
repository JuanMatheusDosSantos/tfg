<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attraction_reservation extends Model
{
    function user()
    {
        return $this->belongsTo(User::class);
    }
    function attraction()
    {
        return $this->belongsTo(Attraction::class);
    }
}
