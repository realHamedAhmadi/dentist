<?php

namespace Modules\User\Services;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;
use Modules\Core\Helpers\Collect;
use Modules\User\Models\Definition\Role;
use Modules\User\Models\User;
use Spatie\Permission\Models\Role as SpatieRole;
use RuntimeException;

class RoleService
{
    /**
     * Find a role by ID considering developer visibility.
     */
    public function find(int $id): Role
    {
        return Role::developers($this->userIsDeveloper())->findOrFail($id);
    }

    /**
     * Get roles list with optional filters and pagination.
     */
    public function get(array $filters = [], bool $paginate = false, int $perPage = 15): Collection|LengthAwarePaginator
    {
        $collect = new Collect($filters);

        $query = Role::query()
            ->when($collect->title, fn($q) => $q->where('title', 'like', "%{$collect->title}%"))
            ->when($collect->name, fn($q) => $q->where('name', $collect->name))
            ->when($collect->guard_name, fn($q) => $q->where('guard_name', $collect->guard_name))
            ->when($collect->reserved, fn($q) => $q->reserved())
            ->when($collect->unreserved, fn($q) => $q->unreserved())
            ->when(!$this->userIsDeveloper(), fn($q) => $q->developers(false));

        return $paginate ? $query->paginate($perPage) : $query->get();
    }

    /**
     * Create a new role.
     */
    public function create(array $data): Role|SpatieRole
    {
        $collect = new Collect($data);

        $this->fillDefaults($collect);
        $this->validateEnglishName($collect->name);
        $this->ensureUniqueName($collect->name, $collect->guard_name);

        return Role::create($collect->only('title', 'name', 'guard_name')->toArray());
    }

    /**
     * Update an existing role.
     */
    public function update(array $data, int $id): Role
    {
        $record = Role::findOrFail($id);
        $collect = new Collect($data);

        if ($collect->has('name')) {
            $this->validateEnglishName($collect->name);
            $this->ensureUniqueName($collect->name, $collect->guard_name ?? $record->guard_name, $id);

        }

        $record->update($collect->only('title', 'name', 'guard_name')->toArray());
        return $record->fresh();
    }

    /**
     * Delete a role safely.
     */
    public function delete(int $id): bool
    {
        $record = Role::query()->unreserved()
            ->developers($this->userIsDeveloper())
            ->findOrFail($id);

        return $record->delete();
    }

    /**
     * Assign one or multiple roles to a user
     */
    public function assignForUser(User|int $user, string|array|Role $roles): array
    {
        $user = $user instanceof User ? $user : User::findOrFail($user);

        if ($roles instanceof Role) {
            $roles = [$roles->name];
        } elseif (is_array($roles) && isset($roles[0]) && $roles[0] instanceof Role) {
            $roles = array_map(fn($r) => $r->name, $roles);
        }

        $user->roles()->unreserved()->detach();
        $user->assignRole($roles);

        return $user->roles->pluck('name')->toArray();
    }

    /**
     * Check if the current user is a developer.
     */
    protected function userIsDeveloper(): bool
    {
        return auth()->user()?->hasRole(Role::ROLE_DEVELOPER) ?? false;
    }

    /**
     * Validate that role name contains only English letters and digits.
     */
    protected function validateEnglishName(?string $name): void
    {
        if (empty($name) || !preg_match('/^[A-Za-z0-9]+$/', $name)) {
            throw new RuntimeException('The name field contains non-English characters.');
        }
    }

    /**
     * Ensure the role name is unique for the given guard.
     */
    protected function ensureUniqueName(string $name, string $guardName, ?int $ignoreId = null): void
    {
        $query = Role::where('name', $name)
            ->where('guard_name', $guardName);

        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        if ($query->exists()) {
            throw new RuntimeException("The name '{$name}' for guard '{$guardName}' already exists.");
        }
    }

    /**
     * Fill default values for missing fields.
     */
    protected function fillDefaults(Collect $collect): void
    {
        if (!$collect->has('guard_name'))
            $collect->put('guard_name', Role::GUARD_API);

        if (!$collect->has('title') && $collect->name) {
            $title = Str::title(Str::replace(['_', '-', '.'], ' ', $collect->name));
            $collect->put('title', $title);
        }
    }
}
