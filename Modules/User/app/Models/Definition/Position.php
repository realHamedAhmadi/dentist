<?php

namespace Modules\User\Models\Definition;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\User\Models\Staff;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'code', 'description'];

    public function staff()
    {
        return $this->hasMany(Staff::class);
    }
}
