<?php

namespace Modules\User\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class VerificationCodeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = \Modules\Verification\Models\VerificationCode::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'code'=>$this->faker->randomDigit(),
        ];
    }
}

