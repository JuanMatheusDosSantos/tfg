<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant_reservation extends Model
{
    function user()
    {
        return $this->belongsTo(User::class);
    }
    function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}
