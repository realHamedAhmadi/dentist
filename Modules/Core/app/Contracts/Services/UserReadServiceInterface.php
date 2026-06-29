<?php

namespace Modules\Core\Contracts\Services;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Modules\User\Models\User;

interface UserReadServiceInterface
{
    public function find(int $id):User;

    public function get(array $filters=[], $paginate = false, $perPage = 15):Collection|LengthAwarePaginator;
}
