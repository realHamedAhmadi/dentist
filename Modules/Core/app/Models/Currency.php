<?php

namespace Modules\Core\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Currency extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];

    public function countries()
    {
        return $this->belongsToMany(Country::class, 'country_currency')
            ->withPivot('is_primary')
            ->withTimestamps();
    }
}
