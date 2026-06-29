<?php

namespace Modules\User\Contracts\Services;

use Modules\User\Models\User;

interface UserWriteServiceInterface
{
    public function create(array $data,bool $userCreationRequired=true):User;

    public function update(array $data,int $id):bool;

    public function delete(int $id):bool;
}
