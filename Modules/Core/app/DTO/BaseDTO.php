<?php

namespace Modules\Core\DTO;

use Illuminate\Support\Str;
use ReflectionClass;
use ReflectionProperty;

abstract class BaseDTO
{
    /**
     * Convert all public properties to array with camelCase keys
     *
     * @return array
     */
    public function toArray(): array
    {
        $arr = [];
        $reflection = new ReflectionClass($this);
        foreach ($reflection->getProperties(ReflectionProperty::IS_PUBLIC) as $prop) {
            $key = $prop->getName();
            $value = $this->{$key};
            $arr[Str::snake($key)] = $value;
        }
        return $arr;
    }
}

