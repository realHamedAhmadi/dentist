<?php

namespace Modules\Core\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Country extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];

    public function currencies()
    {
        return $this->belongsToMany(Currency::class, 'country_currency')
            ->withPivot('is_primary')
            ->withTimestamps();
    }

    public function primaryCurrency()
    {
        return $this->currencies()->wherePivot('is_primary', true);
    }

    public function languages()
    {
        return $this->belongsToMany(Language::class, 'country_language')
            ->withPivot('is_primary')
            ->withTimestamps();
    }

    public function primaryLanguage()
    {
        return $this->languages()->wherePivot('is_primary', true);
    }
}
