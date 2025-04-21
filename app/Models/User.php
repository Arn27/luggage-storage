<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Bookings relationship
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    // Roles relationship (many-to-many)
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    // Business profile if applicable
    public function businessProfile()
    {
        return $this->belongsTo(BusinessProfile::class, 'business_id');
    }

    // Role check helper
    public function hasRole($role)
    {
        return $this->roles()->where('name', $role)->exists();
    }

    // Optional: get all role names easily
    public function getRoleNames()
    {
        return $this->roles->pluck('name');
    }
}
