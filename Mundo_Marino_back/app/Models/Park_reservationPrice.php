<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Park_reservationPrice extends Model
{
    protected $fillable = [
        'park_id',
        'park_reservation_type_id',
        'adult_price',
        'child_price'
        ];

    public function type()
    {
        return $this->belongsTo(Park_reservationType::class, 'park_reservation_type_id');
    }

    public function park()
    {
        return $this->belongsTo(Park::class);
    }
}
