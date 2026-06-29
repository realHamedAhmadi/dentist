<?php

namespace Modules\Core\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Language extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];


    public function countries()
    {
        return $this->belongsToMany(Country::class, 'country_language')
            ->withPivot('is_primary')
            ->withTimestamps();
    }
}
