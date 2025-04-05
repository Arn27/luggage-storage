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
    ];

    // Optional: if you want to auto-cast open_hours JSON to array
    protected $casts = [
        'open_hours' => 'array',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function reviews()
    {
        return $this->hasMany(\App\Models\Review::class);
    }
}
