<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'location_id',
        'date',
        'bag_count',
        'status',
        'start_time',
        'end_time',
        'user_luggage_photo',
        'business_luggage_photo',
        'user_close_photo',
        'business_close_photo',
        'user_start_photo',
        'business_start_photo',
        'user_end_photo',
        'business_end_photo',
        'started_at',
        'ended_at',
        'is_walkin',
    ];
    

    protected $casts = [
        'date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function location()
    {
        return $this->belongsTo(Location::class);
    }
    
}
