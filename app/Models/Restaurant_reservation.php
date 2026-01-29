<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant_reservation extends Model
{
    protected $fillable=[
        "user_id",
        "restaurant_id",
        "reservation_date",
        "reservation_hour",
        "party_size",
        "status",
    ];
    function user()
    {
        return $this->belongsTo(User::class);
    }
    function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}
