<?php

namespace Modules\User\Database\Factories\Definition;

use Illuminate\Database\Eloquent\Factories\Factory;

class RoleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = \Modules\User\Models\Definition\Role::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name'=>$this->faker->name()
        ];
    }
}

