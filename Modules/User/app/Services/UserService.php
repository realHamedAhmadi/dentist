<?php

namespace Modules\User\Services;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Modules\Core\Contracts\Services\UserReadServiceInterface;
use Modules\Core\Helpers\Collect;
use Modules\User\Contracts\Services\UserWriteServiceInterface;
use Modules\User\Exceptions\UniqueValueAlreadyExistsException;
use Modules\User\Models\User;
use Throwable;

class UserService implements UserWriteServiceInterface, UserReadServiceInterface
{

    public function find(int $id): User
    {
        return User::findOrFail($id);
    }

    public function get(array $filters = [], $paginate = false, $perPage = 15): Collection|LengthAwarePaginator
    {
        $collect = new Collect($filters);
        $records = User::query();
        $records->when($collect->name || $collect->full_name, function ($q) use ($collect) {
            $name = $collect->name ?? $collect->full_name;
            $q->whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$name}%"]);
        });

        $records->when($collect->first_name,
            fn($q) => $q->where('first_name', 'LIKE', "%{$collect->first_name}%"));

        $records->when($collect->last_name,
            fn($q) => $q->where('last_name', 'LIKE', "%{$collect->last_name}%"));

        $records->when($collect->phone,
            fn($q) => $q->where('phone', $collect->phone));

        return $paginate ?
            $records->paginate($perPage)
            : $records->get();
    }

    public function create(array $data,$userCreationRequired=true): User
    {
        $collect = new Collect($data);

        if ($this->hasDuplicateUniqueValues($data)) {
            if ($userCreationRequired){
                throw new UniqueValueAlreadyExistsException();
            }
            return new User();
        }

        $inputs = $collect->only([
            'first_name', 'last_name',
            'phone', 'email', 'username',
            'phone_verified_at', 'password',
            'email_verified_at', 'last_login_at'
        ])->toArray();
        $inputs['registered_at'] = now();

        return User::create($inputs);
    }

    public function update(array $data, int $id): bool
    {
        $record = User::findOrFail($id);

        $collect = new Collect($data);

        if ($this->hasDuplicateUniqueValues($data, $id)) {
            throw new UniqueValueAlreadyExistsException();
        }
        $inputs = $collect->only(['first_name', 'last_name', 'phone', 'email'])->toArray();

        if (($record->phone!=$collect->phone) && $collect->phone){
            $inputs['phone_verified_at']=null;
        }
        if (($record->email!=$collect->email) && $collect->email){
            $inputs['email_verified_at']=null;
        }
        return $record->update($inputs);
    }

    /**
     * @throws Throwable
     */
    public function delete(int $id): bool
    {
        return User::findOrFail($id)->delete();
    }

    public function syncRoles(array $roles, $id): User
    {
        $record = User::findOrFail($id);

        $roleNames = $record->roles()->reserved()->pluck('name')->toArray();

        $roles = array_merge($roles, $roleNames);

        return $record->syncRoles($roles);
    }

    public function syncPermissions(array $permissions, $id): User
    {
        $record = User::findOrFail($id);

        return $record->syncPermissions($permissions);
    }

    protected function hasDuplicateUniqueValues(array $inputs, $ignoreId = null): bool
    {
        return User::query()->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
            ->where(function ($q) use ($inputs) {
                foreach (User::getUniqueAttributes() as $attr) {
                    $q->when(isset($inputs[$attr]) && $inputs[$attr], fn($q) => $q->orWhere($attr,$inputs[$attr]));
                }
            })->exists();
    }
}
