<?php

use Illuminate\Support\Facades\Route;
use Spatie\RouteAttributes\RouteRegistrar;

$registrar = new RouteRegistrar(app()->router);
$registrar
    ->useRootNamespace('Modules\User\Http\Controllers\Api\V1\Admin')
    ->group([
        'namespace' => 'Modules\User\Http\Controllers\Api\V1\Admin',
        'middleware'=>'auth:sanctum',
        'prefix' => 'v1/admin',
        'as' => 'v1.admin.',
    ],fn()=>$registrar->registerDirectory(module_path('User','app/Http/Controllers/Api/V1/Admin')));

/*[
    'namespace' => 'Modules\User\Http\Controllers\Api\V1\Admin',
    'middleware'=>'auth:sanctum',
    'prefix' => 'v1/admin',
    'as' => 'v1.admin.',
]*/
