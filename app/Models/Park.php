<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Park extends Model
{
    function attractions()
    {
        return $this->hasMany(Attraction::class);
    }

    function restaurant()
    {
        return $this->hasMany(Restaurant::class);
    }
}
