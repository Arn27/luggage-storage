<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessProfile extends Model
{
    protected $fillable = ['name', 'phone', 'is_approved'];

    public function users()
    {
        return $this->hasMany(User::class, 'business_id');
    }
}
