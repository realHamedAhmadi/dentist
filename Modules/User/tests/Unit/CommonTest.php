<?php

namespace Modules\User\Tests\Unit;

use Illuminate\Support\Str;
use Tests\TestCase;

class CommonTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_that_true_is_true(): void
    {
        echo Str::title(Str::replace(['_','-','.'],' ','admin_rol'));
        $this->assertTrue(true);
    }
}
