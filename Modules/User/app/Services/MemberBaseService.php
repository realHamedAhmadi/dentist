<?php

namespace Modules\User\Services;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\Core\Exceptions\RecordCannotBeDeletedException;
use Modules\Core\Helpers\Collect;
use Modules\User\Exceptions\AlreadyRegisteredForUserException;

class MemberBaseService
{

    protected function __construct(
        protected readonly string $modelClass,
        protected readonly string $roleName,
        protected readonly string $relation,
        protected readonly bool   $isUserRequired,
        protected readonly array  $protectedIds,
    )
    {
    }

    public function find(int $id): Model
    {
        return $this->modelClass::findOrFail($id);
    }

    public function get(array $inputs = [], bool $paginate = false, int $perPage = 15): Collection|LengthAwarePaginator
    {
        $records = $this->baseQuery();
        $this->filterQuery($records, $inputs);

        $this->someQueryInGet($records);

        return $paginate
            ? $records->paginate($perPage)
            : $records->get();
    }

    public function create(array $data): Model
    {
        $collect = new Collect($data);

        DB::beginTransaction();
        try {
            $user = (new UserService())->create($data,$this->isUserRequired);

            $inputs = $collect->toArray();
            $inputs['is_active'] = $collect->is_active ?? false;
            $inputs['user_id'] = $user->id;

            $record = $this->modelClass::create($inputs);

            $user->assignRole($this->roleName);

            $this->created($record, $data);

            DB::commit();

            return $record;
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error($e->getMessage(), ['exception' => $e]);

            throw $e;
        }
    }

    public function createForUser(array $data, int $userId): Model
    {
        $userService = new UserService();
        $user = $userService->find($userId);
        if ($user->{$this->relation}()->exists()) {
            throw new AlreadyRegisteredForUserException();
        }
        $collect = new Collect($data);

        DB::beginTransaction();
        try {
            $inputs = $collect->toArray();
            $inputs['is_active'] = ($collect->is_active and $user->id);
            $inputs['user_id'] = $user->id;

            $userService->update($inputs, $userId);

            $record = $this->modelClass::create($inputs);

            $user->assignRole($this->roleName);

            DB::commit();

            return $record;
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error($e->getMessage(), ['exception' => $e]);

            throw $e;
        }
    }

    public function update(array $data, int $id): Model
    {
        $record = $this->modelClass::findOrFail($id);

        $collect = new Collect($data);
        DB::beginTransaction();
        try {
            $userUpdated = false;
            if ($record->user_id)
                $userUpdated = (new UserService())->update($data, $record->user_id);

            $inputs = $collect->toArray();

            $inputs['is_active'] = $collect->is_active ?? false;;
            $updated = ($record->update($inputs) or $userUpdated);

            $this->updated($record, $data);

            DB::commit();
            return $record->fresh();
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error($e->getMessage(), ['exception' => $e]);

            throw $e;
        }
    }

    public function delete(int $id): bool
    {
        if (in_array($id, $this->protectedIds, true)) {
            throw new RecordCannotBeDeletedException(['id' => $id]);
        }

        return DB::transaction(function () use ($id) {
            $record = $this->modelClass::findOrFail($id);

            if ($record->user) {
                $record->user->removeRole($this->roleName);
            }
            $this->deleting($record);
            return $record->delete();
        });
    }

    protected function baseQuery(): Builder
    {
        return $this->modelClass::query()->with('user');
    }

    protected function filterQuery(Builder $q, array $filter): Builder
    {
        $collect = new Collect($filter);
        $q->when($collect->name || $collect->full_name, function ($q) use ($collect) {
            $name = $collect->name ?? $collect->full_name;
            $q->whereHas('user', fn($q) => $q->whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$name}%"])
            );
        });

        $q->when($collect->first_name,
            fn($q) => $q->whereHas('user', fn($q) => $q->where('first_name', 'LIKE', "%{$collect->first_name}%")
            ));

        $q->when($collect->last_name,
            fn($q) => $q->whereHas('user', fn($q) => $q->where('last_name', 'LIKE', "%{$collect->last_name}%")
            ));

        $q->when($collect->phone,
            fn($q) => $q->whereHas('user', fn($q) => $q->where('phone', $collect->phone)
            ));
        return $q;
    }

    protected function someQueryInGet(Builder $q): Builder
    {
        return $q;
    }

    protected function created(Model $model, array $data): void
    {
        ///
    }

    protected function updated(Model $model, array $data): void
    {
        ////
    }

    protected function deleting(Model $model): void
    {
        ///
    }
}
