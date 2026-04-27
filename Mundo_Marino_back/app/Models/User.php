<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        "phone",
        'password',
        "role",
        'park_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [];
    }

    function park_reservation()
    {
        return $this->hasMany(Park_reservation::class);
    }

    function park()
    {
        return $this->belongsTo(Park::class);
    }
    public function isAdmin(): bool
    {
        return $this->role==="admin";
    }

    public function isParkManager(): bool
    {
        return $this->role==="park";
    }

    public function isRestaurantManager(): bool
    {
        return $this->role==="restaurant";
    }
    public function isUser(): bool
    {
        return $this->role==="user";
    }

    function restaurant_reservation()
    {
        return $this->hasMany(Restaurant_reservation::class);
    }

    function admin_log()
    {
        return $this->hasMany(Admin_log::class);
    }
}
