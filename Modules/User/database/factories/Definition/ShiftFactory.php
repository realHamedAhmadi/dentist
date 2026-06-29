<?php

namespace Modules\User\Database\Factories\Definition;

use Illuminate\Database\Eloquent\Factories\Factory;

class ShiftFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = \Modules\User\Models\Definition\Shift::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name'=>$this->faker->title(),
            'start_time'=>$this->faker->time(),
            'end_time'=>$this->faker->time(),
        ];
    }
}

