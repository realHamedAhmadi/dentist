<?php

namespace Modules\User\Services;

use Illuminate\Database\Eloquent\Model;
use Modules\User\Models\Admin;
use Modules\User\Models\Definition\Role;
use Modules\User\Models\User;
use Throwable;

class AdminService extends MemberBaseService
{
    public function __construct()
    {
        parent::__construct(
            modelClass: Admin::class,
            roleName: Role::ROLE_ADMIN,
            relation: 'admin',
            isUserRequired: true,
            protectedIds:[],
        );
    }

    /**
     * @throws Throwable
     */
    protected function created(Model $model, array $data): void
    {
        (new ClientService())->createForUser($data,$model->user_id);

        if (isset($data['roles']))
            $this->assignRoles($model->user, $data['roles']);
    }

    protected function updated(Model $model, array $data): void
    {
        if (isset($data['roles']))
            $this->assignRoles($model->user, $data['roles']);
    }

    protected function deleting(Model $model): void
    {
        $model->user->roles()->detach();
    }

    protected function assignRoles(User $user, array $roles): void
    {
        if (empty($roles))
            return;
        (new RoleService())->assignForUser($user,$roles);
    }
}
