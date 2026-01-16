<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    function park()
    {
        return $this->belongsTo(Park::class);
    }
    function restaurant_reservation()
    {
        return $this->hasMany(Restaurant_reservation::class);
    }
}
