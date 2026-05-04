<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Park extends Model
{
    use HasFactory;

    protected $fillable=[
        "name",
        "location",
        "opening_time",
        "closing_time"
    ];
    function user()
    {
        return $this->hasMany(User::class);
    }
    function attractions()
    {
        return $this->hasMany(Attraction::class);
    }

    function restaurant()
    {
        return $this->hasMany(Restaurant::class);
    }
    function park_reservations()
    {
        return $this->hasMany(Park_reservation::class);
    }
}
