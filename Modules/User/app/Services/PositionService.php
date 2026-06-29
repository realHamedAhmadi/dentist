<?php

namespace Modules\User\Services;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Core\Helpers\Collect;
use Modules\User\Models\Definition\Position;
use Modules\User\Models\Definition\Role;
use Modules\User\Models\Staff;

class PositionService
{
    public function find(int $id): Position
    {
        return Position::findOrFail($id);
    }

    public function get(array $filters=[], $paginate = false, $perPage = 15): Collection|LengthAwarePaginator
    {
        $collect = new Collect($filters);

        $records = Position::query();

        $records->when($collect->name, fn($q) => $q->where('name', 'LIKE', "%{$collect->name}%"));

        $records->when($collect->code, fn($q) => $q->where('code', 'LIKE', "%{$collect->code}%"));

        return $paginate ?
            $records->paginate($perPage) :
            $records->get();
    }

    public function create(array $data): Position
    {
        $collect = new Collect($data);

        if (Position::where('name', $collect->name)
            ->when($collect->code, fn($q) => $q->orWhere('code', $collect->code)->exists()))
            throw new \RuntimeException('The name or code is already exists!');

        return Position::create($collect->only('name', 'code','description')->toArray());
    }

    public function update(array $data, int $id): Position
    {
        $record = Position::findOrFail($id);

        $collect = new Collect($data);

        if (Position::where('id', '!=', $id)->where(function ($q) use ($collect) {
            $q->where('name', $collect->name)
                ->when($collect->code, fn($q) => $q->orWhere('code', $collect->code));
        })->exists())
            throw new \RuntimeException('The name or code is already exists!');
        $record->update($collect->only('name', 'code','description')->toArray());
        return $record->fresh();
    }

    public function delete(int $id): bool
    {
        $record = Position::findOrFail($id);

        return $record->delete();
    }
}
