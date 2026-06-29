<?php

namespace Modules\Core\Helpers;

use Illuminate\Support\Collection;
use Illuminate\Support\HigherOrderCollectionProxy;

class Collect extends Collection
{
    public function __get($key)
    {
        if (in_array($key,static::$proxies)){
            return new HigherOrderCollectionProxy($this,$key);
        }
        return $this->get($key);
    }
}
