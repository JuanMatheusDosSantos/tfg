<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Park_reservation extends Model
{
    protected $fillable = [
        'user_id',
        'park_id',
        'reservation_date',
        'adults',
        'child',
        'status',
        'codigo_qr',
        'tax_id',
        'adult_price_total',
        'child_price_total',
        'applied_tax',
        'park_reservation_type_id',
    ];
    function user()
    {
        return $this->belongsTo(User::class);
    }
    function park()
    {
        return $this->belongsTo(Park::class);
    }
    function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
