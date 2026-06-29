<?php

namespace Modules\User\Tests\Unit\Traits;

use Illuminate\Support\Facades\Log;
use Mockery;
use Modules\User\Models\Staff;
use Modules\User\Traits\SomeRule;
use Tests\TestCase;

class SomeRuleTest extends TestCase
{

    use SomeRule;

    protected static $devSetting;

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_returns_digits_rule_for_numeric_fixed_national_code_length()
    {
        static::$devSetting = Mockery::mock();
        static::$devSetting->shouldReceive('minNationalCodeLength')->andReturn(10);
        static::$devSetting->shouldReceive('maxNationalCodeLength')->andReturn(10);
        static::$devSetting->shouldReceive('nationalCodeIsNumeric')->andReturn(true);

        $rule = $this->getNationalCodeRule();

        $this->assertEquals(['nullable', 'numeric', 'digits:10'], $rule);
    }

    /** @test */
    public function it_returns_digits_between_rule_for_numeric_variable_national_code_length()
    {
        static::$devSetting = Mockery::mock();
        static::$devSetting->shouldReceive('minNationalCodeLength')->andReturn(8);
        static::$devSetting->shouldReceive('maxNationalCodeLength')->andReturn(10);
        static::$devSetting->shouldReceive('nationalCodeIsNumeric')->andReturn(true);

        $rule = $this->getNationalCodeRule();

        $this->assertEquals(['nullable', 'numeric', 'digits_between:8,10'], $rule);
    }

    /** @test */
    public function it_returns_size_rule_for_string_fixed_national_code_length()
    {
        static::$devSetting = Mockery::mock();
        static::$devSetting->shouldReceive('minNationalCodeLength')->andReturn(12);
        static::$devSetting->shouldReceive('maxNationalCodeLength')->andReturn(12);
        static::$devSetting->shouldReceive('nationalCodeIsNumeric')->andReturn(false);

        $rule = $this->getNationalCodeRule();

        $this->assertEquals(['nullable', 'string', 'size:12'], $rule);
    }

    /** @test */
    public function it_returns_between_rule_for_string_variable_national_code_length()
    {
        static::$devSetting = Mockery::mock();
        static::$devSetting->shouldReceive('minNationalCodeLength')->andReturn(5);
        static::$devSetting->shouldReceive('maxNationalCodeLength')->andReturn(15);
        static::$devSetting->shouldReceive('nationalCodeIsNumeric')->andReturn(false);

        $rule = $this->getNationalCodeRule();

        $this->assertEquals(['nullable', 'string', 'between:5,15'], $rule);
    }

    /** @test */
    public function it_returns_digits_between_rule_for_numeric_variable_phone_length()
    {
        static::$devSetting = Mockery::mock();
        static::$devSetting->shouldReceive('minPhoneLength')->andReturn(8);
        static::$devSetting->shouldReceive('maxPhoneLength')->andReturn(10);

        $rule = $this->getPhoneRule(Staff::table());
        $this->assertContains('digits_between:9,11', $rule);
    }

}
