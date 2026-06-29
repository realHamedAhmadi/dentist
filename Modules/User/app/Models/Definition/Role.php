<?php

namespace Modules\User\Models\Definition;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use HasFactory;

    protected $fillable = ['title','name','guard_name','reserved'];

    const ROLE_CLIENT = 'client';

    const ROLE_ADMIN='admin';

    const ROLE_OWNER='owner';

    const ROLE_STAFF='staff';

    const ROLE_EXPERT='expert';

    const ROLE_DEVELOPER='developer';

    const GUARDS=['web','api'];

    const GUARD_WEB='web';

    const GUARD_API='api';

    const RESERVE_ROLES=[
        self::ROLE_ADMIN,self::ROLE_CLIENT,self::ROLE_EXPERT,
        self::ROLE_DEVELOPER,self::ROLE_OWNER,self::ROLE_STAFF
    ];

    public function scopeReserved($q)
    {
        return $q->where('reserved',true);
    }

    public function scopeUnreserved($q)
    {
        return $q->where('reserved',false);
    }

    public function scopeDevelopers($q,$flag=true)
    {
        return $q->where('for_developer',$flag);
    }

    public function scopeApiGuard($q)
    {
        return $q->where('guard_name',self::GUARD_API);
    }

    public function scopeWebGuard($q)
    {
        return $q->where('guard_name',self::GUARD_WEB);
    }

    protected function title(): Attribute
    {
        return Attribute::make(
          set:  function ($value, $attributes) {
                return $value ?? ($attributes['name'] ?? null);
            },
        );
    }
}
