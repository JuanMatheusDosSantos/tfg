<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    function user()
    {
        return $this->belongsTo(User::class);
    }
    function attraction()
    {
        return $this->belongsTo(Attraction::class);
    }
}
