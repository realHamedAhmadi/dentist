<?php

namespace Modules\User\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\User\Database\Factories\OwnerFactory;

class Owner extends Model
{
    use HasFactory;

    const MAIN_OWNER_ID=1;

    protected $fillable=['user_id','national_code','share_type','share_value','address','is_active'];

    protected function phone(): Attribute
    {
        return Attribute::make(
            get:fn()=>$this->user->phone,
        )->shouldCache();
    }

    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->user->full_name,
        )->shouldCache();
    }

    protected function firstName(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->user->first_name,
        )->shouldCache();
    }

    protected function lastName(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->user->last_name,
        )->shouldCache();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
