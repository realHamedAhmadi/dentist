<?php

namespace Modules\User\Services;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Core\Helpers\Collect;
use Modules\User\Models\Definition\Shift;

class ShiftService
{
    public function find(int $id): Shift
    {
        return Shift::findOrFail($id);
    }

    public function get(array $filters=[], $paginate = false, $perPage = 15): Collection|LengthAwarePaginator
    {
        $collect = new Collect($filters);

        $records = Shift::query();

        $records->when($collect->name, fn($q) => $q->where('name', 'LIKE', "%{$collect->name}%"));

        return $paginate ?
            $records->paginate($perPage) :
            $records->get();
    }

    public function create(array $data): Shift
    {
        $collect = new Collect($data);

        if (Shift::where('name', $collect->name)->exists())
            throw new \RuntimeException('The name is already exists!');

        return Shift::create($collect->only('name', 'start_time','end_time')->toArray());
    }

    public function update(array $data, int $id): Shift
    {
        $record = Shift::findOrFail($id);

        $collect = new Collect($data);

        if (Shift::where('id', '!=', $id)->where('name', $collect->name)->exists())
            throw new \RuntimeException('The name is already exists!');
        $record->update($collect->only('name', 'start_time','end_time')->toArray());
        return $record->fresh();
    }

    public function delete(int $id): bool
    {
        $record = Shift::findOrFail($id);

        return $record->delete();
    }
}
