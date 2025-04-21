<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
        'business_id',
        'name',
        'address',
        'city',
        'lat',
        'lng',
        'description',
        'max_bags',
        'open_hours',
        'hourly_rate',
    ];

    protected $casts = [
        'open_hours' => 'array',
    ];

    public function business()
    {
        return $this->belongsTo(\App\Models\BusinessProfile::class, 'business_id');
    }

    public function reviews()
    {
        return $this->hasMany(\App\Models\Review::class);
    }
}
