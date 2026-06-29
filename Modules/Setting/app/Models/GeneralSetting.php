<?php

namespace Modules\Setting\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Setting\Database\Factories\GeneralSettingFactory;

class GeneralSetting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['verification_ttl'];

    protected static $cached;
    const ID = 1;

    protected static function booted()
    {
        static::$cached = static::find(static::ID);
    }

    public static function verificationTtl(): int
    {
        if (!static::$cached)
            static::booted();
        return static::$cached->verification_ttl??5;
    }
}
