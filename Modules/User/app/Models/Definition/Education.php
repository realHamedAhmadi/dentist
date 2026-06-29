<?php

namespace Modules\User\Models\Definition;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    use HasFactory;
    protected $table='educations';
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['name'];

}
