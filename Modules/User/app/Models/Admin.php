<?php

namespace Modules\User\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Admin extends Model
{
    use HasFactory;

    protected $fillable=['user_id','is_active'];

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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

}
