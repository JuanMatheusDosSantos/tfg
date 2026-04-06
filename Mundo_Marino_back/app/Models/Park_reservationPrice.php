<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Park_reservationPrice extends Model
{
    protected $fillable = ['park_id', 'park_reservation_type_id', 'price'];

    public function type()
    {
        return $this->belongsTo(Park_reservationtype::class, 'park_reservation_type_id');
    }

    public function park()
    {
        return $this->belongsTo(Park::class);
    }
}
