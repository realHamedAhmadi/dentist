<?php

namespace Modules\User\Services;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Core\Helpers\Collect;
use Modules\User\Models\Definition\Specialty;

class SpecialtyService
{
    public function find(int $id): Specialty
    {
        return Specialty::findOrFail($id);
    }

    public function get(array $filters=[], $paginate = false, $perPage = 15): Collection|LengthAwarePaginator
    {
        $collect = new Collect($filters);

        $records = Specialty::query();

        $records->when($collect->name, fn($q) => $q->where('name', 'LIKE', "%{$collect->name}%"));

        return $paginate ?
            $records->paginate($perPage) :
            $records->get();
    }

    public function create(array $data): Specialty
    {
        $collect = new Collect($data);

        if (Specialty::where('name', $collect->name)->exists())
            throw new \RuntimeException('The name is already exists!');

        return Specialty::create($collect->only('name')->toArray());
    }

    public function update(array $data, int $id): Specialty
    {
        $record = Specialty::findOrFail($id);

        $collect = new Collect($data);

        if (Specialty::where('id', '!=', $id)->where('name', $collect->name)->exists())
            throw new \RuntimeException('The name is already exists!');
        $record->update($collect->only('name')->toArray());
        return $record->fresh();
    }

    public function delete(int $id): bool
    {
        $record = Specialty::findOrFail($id);

        return $record->delete();
    }
}
