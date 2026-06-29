<?php

namespace Modules\User\Models\Definition;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\User\Models\Staff;

class ContractType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function staff()
    {
        return $this->hasOne(Staff::class);
    }
};
