<?php

namespace Modules\User\Models\Definition;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BloodGroup extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['name','rh'];

    public function type():Attribute
    {
        return Attribute::make(
            get:fn()=>strtoupper($this->name).$this->rh,

        )->shouldCache();
    }

}
