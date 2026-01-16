<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Park_reservation extends Model
{
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
