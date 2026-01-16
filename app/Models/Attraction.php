<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attraction extends Model
{
    function park()
    {
        return $this->belongsTo(Park::class);
    }
    function attraction_reservation()
    {
        return $this->hasMany(Attraction_reservation::class);
    }
}
