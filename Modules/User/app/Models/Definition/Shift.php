<?php

namespace Modules\User\Models\Definition;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\User\Models\Staff;

class Shift extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'start_time',
        'end_time',
    ];

    public function staff()
    {
        return $this->hasOne(Staff::class);
    }
};
