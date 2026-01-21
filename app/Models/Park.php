<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Park extends Model
{
    protected $fillable=[
        "name",
        "location",
        "opening_time",
        "closing_time"
    ];
    function attractions()
    {
        return $this->hasMany(Attraction::class);
    }

    function restaurant()
    {
        return $this->hasMany(Restaurant::class);
    }
}
