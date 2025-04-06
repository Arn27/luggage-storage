<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Business extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'business_name',
        'email',
        'password',
        'phone',
        'is_approved',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
    ];

    // If businesses have locations:
    public function locations()
    {
        return $this->hasMany(Location::class);
    }
}
