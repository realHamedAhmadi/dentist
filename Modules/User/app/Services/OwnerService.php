<?php

namespace Modules\User\Services;

use Illuminate\Database\Eloquent\Model;
use Modules\User\Models\Definition\Role;
use Modules\User\Models\Owner;
use Throwable;

class OwnerService extends MemberBaseService
{
    public function __construct()
    {
        parent::__construct(
            modelClass: Owner::class,
            roleName: Role::ROLE_OWNER,
            relation: 'owner',
            isUserRequired: false,
            protectedIds:[Owner::MAIN_OWNER_ID],
        );
    }
    /**
     * @throws Throwable
     */
    protected function created(Model $model, array $data): void
    {
        (new ClientService())->createForUser($data,$model->user_id);
    }
}
