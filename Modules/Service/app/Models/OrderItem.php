<?php

namespace Modules\Service\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Modules\Core\Contracts\Repositories\ClientRepositoryInterface;
use Modules\Core\Contracts\Repositories\UserRepositoryInterface;
use Modules\User\Models\Client;

class OrderItem extends Model
{
    protected static $clientModelClass;
    protected static $userModelClass;

    public static function newOrderId()
    {
        return static::max('order_id') + 1;
    }

    public function client()
    {
        if (!static::$clientModelClass)
            static::$clientModelClass = App::get(ClientRepositoryInterface::class)->getModel();
        return $this->belongsTo(static::$clientModelClass);
    }


    public function provider()
    {
        if (!static::$userModelClass)
            static::$userModelClass = App::get(UserRepositoryInterface::class)->getModel();
        return $this->belongsTo(static::$userModelClass);
    }

    public function registrar()
    {
        if (!static::$userModelClass)
            static::$userModelClass = App::get(UserRepositoryInterface::class)->getModel();
        return $this->belongsTo(static::$userModelClass);
    }
}
