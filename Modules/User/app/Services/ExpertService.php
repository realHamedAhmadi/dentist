<?php

namespace Modules\User\Services;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Modules\User\Enums\ShareType;
use Modules\User\Models\Definition\Role;
use Modules\User\Models\Expert;
use Throwable;

class ExpertService extends MemberBaseService
{
    public function __construct()
    {
        parent::__construct(
            modelClass: Expert::class,
            roleName: Role::ROLE_EXPERT,
            relation: 'expert',
            isUserRequired: false,
            protectedIds:[],
        );
    }

    public function getSpecialties(int $id)
    {
        $record = Expert::findOrFail($id);
        return $record->specialties;
    }

    protected function baseQuery(): Builder
    {
        return $this->modelClass::with('user', 'specialties');
    }

    /**
     * @throws Throwable
     */
    protected function created(Model $model, array $data): void
    {
        (new ClientService())->createForUser($data,$model->user_id);

        if (isset($data['specialties']) and $model instanceof Expert)
            $this->syncSpecialties($model, $data['specialties']);
    }

    protected function updated(Model $model, array $data): void
    {
        if (isset($data['specialties']) and $model instanceof Expert)
            $this->syncSpecialties($model, $data['specialties']);
    }

    protected function deleting(Model $model): void
    {
        $model->specialties()->detach();
    }

    protected function syncSpecialties(Expert $expert, array $data): void
    {
        $expert->specialties()->sync($this->specialtiesInputs($data));

    }

    protected function specialtiesInputs(array $data): array
    {
        $specialties = [];
        foreach ($data as $specialty) {
            $specialties[$specialty['id']]['share_type'] = $specialty['share_type'] ?? ShareType::PERCENTAGE->value;
            $specialties[$specialty['id']]['share_value'] = $specialty['share_value'] ?? 0;
        }
        return $specialties;
    }
}
