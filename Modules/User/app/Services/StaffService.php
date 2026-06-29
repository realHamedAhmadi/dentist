<?php

namespace Modules\User\Services;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Modules\User\Models\Definition\Role;
use Modules\User\Models\Staff;
use Throwable;

class StaffService extends MemberBaseService
{
    public function __construct()
    {
        parent::__construct(
            modelClass: Staff::class,
            roleName: Role::ROLE_STAFF,
            relation: 'staff',
            isUserRequired: false,
            protectedIds:[],
        );
    }

    protected function baseQuery(): Builder
    {
        return $this->modelClass::with('user','position','shift');
    }

    /**
     * @throws Throwable
     */
    protected function created(Model $model, array $data): void
    {
        (new ClientService())->createForUser($data,$model->user_id);
    }
}
