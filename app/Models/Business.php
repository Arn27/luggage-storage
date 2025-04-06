<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Business extends Authenticatable
{
    use HasApiTokens, HasFactory;

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

    public function locations()
    {
        return $this->hasMany(Location::class);
    }
}
