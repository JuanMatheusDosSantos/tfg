<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin_log extends Model
{
    function user()
    {
        return $this->belongsTo(User::class);
    }
}
