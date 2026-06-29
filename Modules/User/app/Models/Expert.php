<?php

namespace Modules\User\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;
use Modules\User\Database\Factories\ExpertFactory;
use Modules\User\Models\Definition\Specialty;

// use Modules\User\Database\Factories\ExpertFactory;

class Expert extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'license_number',
        'experience_years',
        'degree',
        'bio',
        'address',
        'is_active',
    ];

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

    public function specialties():BelongsToMany
    {
        return $this->belongsToMany(Specialty::class, 'expert_specialty')
            ->withPivot(['share_value','share_type']) // سهم متغیر برای هر تخصص
            ->withTimestamps();
    }

    public function user():BelongsTo
    {
        return $this->belongsTo(User::class);
    }

}
