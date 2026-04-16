<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $fillable = [
        "name",
        "max_capacity",
        "park_id",
        "opening_time",
        "closing_time",
    ];
    function park()
    {
        return $this->belongsTo(Park::class);
    }
    function restaurant_reservation()
    {
        return $this->hasMany(Restaurant_reservation::class);
    }
}
