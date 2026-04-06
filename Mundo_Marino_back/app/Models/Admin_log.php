<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin_log extends Model
{
    protected $fillable = ['user_id', 'action', 'affected_zone', 'old_value', 'new_value'];
    function user()
    {
        return $this->belongsTo(User::class);
    }
}
