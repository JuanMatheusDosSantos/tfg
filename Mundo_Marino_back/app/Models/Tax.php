<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tax extends Model
{
    protected $fillable = ['name', 'percentage', 'active'];

    public function park_reservation(){
        return $this->hasMany(Park_reservation::class);
    }
}
