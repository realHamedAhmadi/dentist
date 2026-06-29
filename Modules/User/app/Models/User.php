<?php

namespace Modules\User\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;
use Modules\User\Models\Definition\Role;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use Notifiable, HasFactory,HasRoles,HasApiTokens;

    protected string $guard_name = Role::GUARD_API;

    protected $fillable = [
        'first_name',
        'last_name',
        'phone',
        'email',
        'username',
        'password',
        'registered_at',
        'last_login_at',
        'last_activity_at',
        'phone_verified_at',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
    ];

    public static function getUniqueAttributes():array
    {
        return [
           'phone','email'
        ];
    }

    protected function password(): Attribute
    {
        return Attribute::make(
            set: fn($value) => $value?Hash::make($value):null,
        );
    }

    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => Str::ucfirst($this->first_name) . ' ' . Str::ucfirst($this->last_name),
        )->shouldCache();
    }

    protected function isActive(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->admin?->is_active || $this->owner?->is_active || $this->client?->is_active,
        )->shouldCache();
    }

    // Check if user has a permission (direct or via roles)
    public function hasPermission(string $permissionName): bool
    {
        if ($this->permissions->contains('name', $permissionName)) {
            return true;
        }

        foreach ($this->roles as $role) {
            if ($role->permissions->contains('name', $permissionName)) {
                return true;
            }
        }

        return false;
    }

    // Remove role from user
    public function removeRole($role)
    {
        if (is_string($role)) {
            $role = Role::where('name', $role)->first();
        }

        if ($role) {
            $this->roles()->detach($role);
        }
    }

    public function client()
    {
        return $this->hasOne(Client::class);
    }

    public function owner()
    {
        return $this->hasOne(Owner::class);
    }

    public function admin()
    {
        return $this->hasOne(Admin::class);
    }

    public function expert()
    {
        return $this->hasOne(Expert::class);
    }

    public function staff()
    {
        return $this->hasOne(Staff::class);
    }
}
