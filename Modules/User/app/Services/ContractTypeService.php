<?php

namespace Modules\User\Services;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Core\Helpers\Collect;
use Modules\User\Models\Definition\ContractType;

class ContractTypeService
{
    public function find(int $id): ContractType
    {
        return ContractType::findOrFail($id);
    }

    public function get(array $filters=[], $paginate = false, $perPage = 15): Collection|LengthAwarePaginator
    {
        $collect = new Collect($filters);

        $records = ContractType::query();

        $records->when($collect->name, fn($q) => $q->where('name', 'LIKE', "%{$collect->name}%"));

        return $paginate ?
            $records->paginate($perPage) :
            $records->get();
    }

    public function create(array $data): ContractType
    {
        $collect = new Collect($data);

        if (ContractType::where('name', $collect->name)->exists())
            throw new \RuntimeException('The name is already exists!');

        return ContractType::create($collect->only('name')->toArray());
    }

    public function update(array $data, int $id): ContractType
    {
        $record = ContractType::findOrFail($id);

        $collect = new Collect($data);

        if (ContractType::where('id', '!=', $id)->where('name', $collect->name)->exists())
            throw new \RuntimeException('The name is already exists!');
        $record->update($collect->only('name')->toArray());
        return $record->fresh();
    }

    public function delete(int $id): bool
    {
        $record = ContractType::findOrFail($id);

        return $record->delete();
    }
}
