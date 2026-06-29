<?php

namespace Modules\User\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Modules\User\Models\Definition\BloodGroup;
use Modules\User\Models\Definition\Education;

class Client extends Model
{
    use HasFactory;

    protected $fillable=[
        'user_id','family_id','first_name',
        'last_name','phone','national_code',
        'birth_date','gender','father_name',
        'education_id','job','blood_group_id',
        'is_married','is_pregnant','address','notes','is_active',
    ];

    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => Str::ucfirst($this->first_name) . ' ' . Str::ucfirst($this->last_name),
        )->shouldCache();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function education()
    {
        return $this->belongsTo(Education::class);
    }

    public function bloodGroup()
    {
        return $this->belongsTo(BloodGroup::class);
    }
}
