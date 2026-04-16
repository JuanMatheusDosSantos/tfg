<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Park_reservationType extends Model
{
    protected $fillable=["name"];
    public function ParkReservationPrices()
    {
        return $this->hasMany(Park_reservationPrice::class);
    }
}
