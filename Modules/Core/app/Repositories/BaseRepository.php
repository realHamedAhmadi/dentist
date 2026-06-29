<?php

namespace Modules\Core\Repositories;
use Modules\Core\Contracts\Repositories\BaseRepositoryInterface;
abstract class BaseRepository implements BaseRepositoryInterface
{
    public function __construct(protected string $model){}

    public function getModel(): string
    {
        return $this->model;
    }

    public function findById($id)
    {
        return $this->model::find($id);
    }



    public function create($data)
    {
        return $this->model::create($data);
    }

}
